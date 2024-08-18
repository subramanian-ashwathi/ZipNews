import os

PORT = 5005
HOST = "0.0.0.0"
APP_NAME = "zipnews"

API_VERSION = "/v1"

ES_INDEX_NAME = os.environ.get("ES_INDEX", "news")

NEWS_COUNT = 25

DATE_FORMAT = "%Y-%m-%d %H:%M:%S" # 2023-01-01%2000:00:00
NEWS_WINDOW = 2 # number of days

ES_HOST = os.environ.get("ES_HOST", "localhost:9200")
ES_USER = os.environ.get("ES_USER", "elastic")
ES_PASSWORD = os.environ.get("ES_PASSWORD", "123456")
ES_CERT_PATH = os.environ.get("ES_CERT", "/Users/ashutoshgandhi/BMCP/elasticsearch-8.6.1/config/certs/http_ca.crt")
ES_CONNECTION_STRING = f"https://{ES_USER}:{ES_PASSWORD}@{ES_HOST}"


STATE_COUNT_REQ_BODY = {
  "size" : 0,
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "published_time": {
              "lte": "{end_time}",
              "gte": "{start_time}"
            }
          }
        }
      ]
    }
  },
  "aggs": {
    "state_code": {
      "terms": {
        "field": "state_code",
        "order": { "_count": "asc" },
        "size": 60
      }
    }
  }
}

STATE_SEARCH_REQ_BODY = {
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "published_time": {
              "lte": "{end_time}",
              "gte": "{start_time}"
            }
          }
        },
        {
          "match": {
            "state_code": "{state_code}"
          }
        }
      ]
    }
  },
  "sort": [
    {
      "published_time": {
        "order": "desc"
      }
    }
  ]
}

SEARCH_REQ_BODY = {
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "published_time": {
              "lte": "{end_time}",
              "gte": "{start_time}"
            }
          }
        },
        {
          "bool": {
            "should": [
              {
                "match_phrase": {
                  "title": "{search_phrase}"
                }
              },
              {
                "match_phrase": {
                  "contextual_text": "{search_phrase}"
                }
              }
            ]
          }
        }
      ]
    }
  },
  "sort": [
    {
      "published_time": {
        "order": "desc"
      }
    }
  ]
}