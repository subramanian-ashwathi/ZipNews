## Setup Elasticsearch and Kibana

Start elasticsearchh by going to `elasticsearch` dir and run `make deploy`
Read more on `elasticsearch/README.md` for more details

## Indexing the news

Getting data from google bigquery costs console credits. It allows upto 1TB of processing free for a month. There is an existing file for the news [here](https://drive.google.com/file/d/1oNM1n5GziVBeA99fRhUUQ4_DBQltMOMF/view?usp=share_link). Place this file in this directory. By default, the script gets from the local dataset. To index news to elasticsearch, run the following

### Dev
To index data, run these following

```bash
make build-dev
make deploy
kubectl create secret generic gcloud-iam
kubectl exec -it deployment/zipnews-news-loader bash
```

Inside the container, now run

```bash
python loader.py --start-date=2023-01-01 --end-date=2023-01-31
```

This will index the news to elasticsearch

### Prod
To get from big query, a google service account is needed. Follow this [documentation](https://cloud.google.com/iam/docs/service-accounts-create) to create service account and this [so post](https://stackoverflow.com/questions/46287267/how-can-i-get-the-file-service-account-json-for-google-translate-api) and get the json file. To get data from bigquery and run the script

```bash
LOAD_FROM_BQ=1 SERVICE_ACCOUNT_FILE=/path/to/gcloud-iam.json python loader.py --start-date='2023-01-01' --end-date='2023-01-20'
```