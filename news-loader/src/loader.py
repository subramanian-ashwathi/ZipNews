import json
import logging
import uuid
import os
import pandas as pd
import argparse
import traceback

import elasticsearch
from google.cloud import bigquery
from google.oauth2 import service_account

import config
from elasticsearch.helpers import scan

logging.basicConfig(level=logging.NOTSET)

parser = argparse.ArgumentParser()
parser.add_argument("--start-date", type=str,
                    help="start-date")
parser.add_argument("--end-date", type=str,
                    help="end-date")

args = parser.parse_args()

LOAD_FROM_BQ = True if int(os.environ.get("LOAD_FROM_BQ", 0)) else False
LOCAL_DATASET = os.environ.get("LOCAL_DATASET", "dataset")
SERVICE_ACCOUNT_FILE = os.environ.get("SERVICE_ACCOUNT_FILE", "/tmp/gcloud-iam.json")

if LOAD_FROM_BQ:
    credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

    # Construct a BigQuery client object.
    client = bigquery.Client(credentials=credentials)

class ElasticClient(object):
    def __init__(self, hosts=[config.ES_CONNECTION_STRING], **kwargs):
        self.client = elasticsearch.Elasticsearch(hosts, ca_certs=config.ES_CERT_PATH,
                    basic_auth=(config.ES_USER, config.ES_PASSWORD), verify_certs=False)
    
    def search(self, index_name, search_query, **kwargs):
        try:
            resp = self.client.search(index=index_name, body=search_query, **kwargs)
            return resp
        except Exception as ex:
            traceback.print_exc()
    def scan_search(self, index_name, search_query, **kwargs):
        try:
            resp = scan(self.client, query=search_query, index=index_name, **kwargs)
            return resp
        except Exception as ex:
            traceback.print_exc()
    def create_index(self, index_name, mappings, **kwargs):
        try:
            resp = self.client.indices.create(index=index_name, body=mappings, **kwargs)
            return resp
        except Exception as ex:
            traceback.print_exc()
    def bulk_update(self, operations, **kwargs):
        try:
            resp = self.client.bulk(operations=operations)
            return resp
        except Exception as ex:
            traceback.print_exc()

try:
    es = ElasticClient()
except Exception as ex:
    traceback.print_exc()
    print("Failed to connect to elasticsearch")

INDEX_NAME = "news-v1"

def get_bq_data(client, start_date, end_date, limit=None):
  query = """
      WITH added_row_number AS (
    SELECT
      *,
      ROW_NUMBER() OVER(PARTITION BY Title,Adm1Code) AS row_number
    FROM `gdelt-bq.covid19.onlinenewsgeo`
  )
  SELECT
    *
  FROM added_row_number
  WHERE row_number = 1 and DATE(DateTime) between "{}" and "{}" and CountryCode = "US"
  """
  
  # query = """
  # select * from  `gdelt-bq.covid19.onlinenewsgeo` where DATE(DateTime) between "{}" and "{}" and CountryCode = "US"
  # """
  if limit is not None:
     query += f" limit {limit}"

  logging.info(f"Fetching data from {start_date} to {end_date}")
  query_job = client.query(query.format(start_date, end_date))  # Make an API request.

  df = query_job.to_dataframe()
  logging.info(f"Fetched {df.shape[0]} news")

  df["state_code"] = df["Adm1Code"].apply(lambda x: x[2:])
  df["source"] = "gdelt-bq.covid19.onlinenewsgeo"
  df = df.rename(
      columns={
          "DateTime": "published_time",
          "URL": "url",
          "Title": "title",
          "SharingImage": "image_url",
          "DocTone": "doc_tone",
          "Location": "location",
          "ContextualText": "contextual_text",
      }
  )
  df["published_time"] = df["published_time"].dt.strftime("%Y-%m-%d %H:%M:%S")
  return df


def generate_dataset(df, index_name):
    for record in df.to_dict(orient="records"):
        yield {
            "index": {
                "_index": index_name,
                "_id": uuid.uuid3(
                    uuid.NAMESPACE_DNS, f"{record['published_time']}-{record['title']}-{record['state_code']}"
                ),
            }
        }
        yield record



def bulk_update(index_name, df):
  with open("mappings.json", "r") as f:
      mappings = json.load(f)

  logging.info(f"Trying to create index {index_name}")
  es.create_index(index_name=index_name, mappings=mappings, ignore=[400])

  logging.info(f"Indexing {df.shape[0]} news")
  es.bulk_update(operations=generate_dataset(df, INDEX_NAME))


if LOAD_FROM_BQ:
  dataset = get_bq_data(client, args.start_date, args.end_date)
else:
  print(args.start_date)
  dataset = pd.read_csv(LOCAL_DATASET)
  dataset['published_time'] = pd.to_datetime(dataset['published_time'])
  dataset = dataset[(dataset['published_time']>=args.start_date) & (dataset['published_time']<=args.end_date)]
  dataset["published_time"] = dataset["published_time"].dt.strftime("%Y-%m-%d %H:%M:%S")


dataset.to_csv("news_mar_2023.csv")
bulk_update(INDEX_NAME, dataset)