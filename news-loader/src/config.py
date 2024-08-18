import os

APP_NAME = "zipnews"

API_VERSION = "/v1"

ES_INDEX_NAME = "news"

NEWS_COUNT = 10

DATE_FORMAT = "%Y-%m-%d %H:%M:%S" # 2023-01-01%2000:00:00
NEWS_WINDOW = 2 # number of days

ES_HOST = os.environ.get("ES_HOST", "localhost:9200")
ES_USER = os.environ.get("ES_USER", "elastic")
ES_PASSWORD = os.environ.get("ES_PASSWORD", "123456")
ES_CERT_PATH = os.environ.get("ES_CERT", "/Users/ashutoshgandhi/BMCP/elasticsearch-8.6.1/config/certs/http_ca.crt")
ES_CONNECTION_STRING = f"https://{ES_USER}:{ES_PASSWORD}@{ES_HOST}"