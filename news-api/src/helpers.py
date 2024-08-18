import elasticsearch
import config
import traceback
import random

from elasticsearch.helpers import scan

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

try:
    es = ElasticClient()
except Exception as ex:
    traceback.print_exc()
    print("Failed to connect to elasticsearch")

def create_news_resp(results):
    news = []
    for article in results:
        src = article["_source"]
        info = {
            "title": src["title"],
            "url": src["url"],
            "semantic_score": round(float(src["doc_tone"]), 3),
            "location": src["location"],
            "image_url": src["image_url"],
            "pub_time": src["published_time"],
            "category": src.get("predicted_category", "None")
        }
        news.append(info)
    return news


def get_news_per_state(start_time, end_time, state_code):
    search_query = config.STATE_SEARCH_REQ_BODY
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["lte"] = end_time
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["gte"] = start_time
    search_query["query"]["bool"]["must"][1]["match"]["state_code"] = state_code
    print(search_query)
    resp = es.scan_search(config.ES_INDEX_NAME, search_query)
    results = []
    for hit in resp:
        results.append(hit)
    # if len(results) > config.NEWS_COUNT:
    #     random_selection = random.sample(results, config.NEWS_COUNT)
    # else:
    #     random_selection = results # select all available news
    # news = create_news_resp(random_selection)
    news = create_news_resp(results)
    print(len(results))
    # print(results[0])
    return news

def search_news_in_range(start_time, end_time, search_phrase):
    search_query = config.SEARCH_REQ_BODY
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["lte"] = end_time
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["gte"] = start_time
    search_query["query"]["bool"]["must"][1]["bool"]["should"][0]["match_phrase"]["title"] = search_phrase
    search_query["query"]["bool"]["must"][1]["bool"]["should"][1]["match_phrase"]["contextual_text"] = search_phrase
    print(search_query)
    resp = es.scan_search(config.ES_INDEX_NAME, search_query)
    results = []
    for hit in resp:
        results.append(hit)
    news = create_news_resp(results)
    return news


def get_state_news_count(date):
    start_time = date + " 00:00:00"
    end_time = date + " 23:59:59"
    search_query = config.STATE_COUNT_REQ_BODY
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["lte"] = end_time
    search_query["query"]["bool"]["must"][0]["range"]["published_time"]["gte"] = start_time
    print(search_query)
    resp = es.search(config.ES_INDEX_NAME, search_query)
    # print(resp)
    results = []
    for state in resp["aggregations"]["state_code"]["buckets"]:
        temp = {
            "state_code": state["key"],
            "count": state["doc_count"]
        }
        results.append(temp)
    return results