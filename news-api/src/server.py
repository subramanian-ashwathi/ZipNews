from flask import Flask, Response, make_response, jsonify, request
from flask_cors import CORS, cross_origin
import config
import json
import datetime
import traceback
import requests
from helpers import get_news_per_state, get_state_news_count, search_news_in_range
from validator import valid_date_format, valid_dates


app = Flask(__name__)
base_route = config.API_VERSION
CORS(app)

@app.route(f"{base_route}/")
@app.route(f"{base_route}/health")
@app.route("/")
@app.route("/health")
@cross_origin()
def hello():
    resp = {
        "validPaths": ["/v1/count","/v1/news?start_time=<start_time>&end_time=<end_time>&state_code=<code>"],
        "msg": "Zipnews API Service. Use one of the mentioned valid endpoints",
        "version": base_route.strip("/")
    }
    return Response(response=json.dumps(resp), status=200, mimetype="application/json")

@app.route(f"{base_route}/news", methods=["GET"])
@cross_origin()
def get_news():
    try:
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")
        state_code = request.args.get("state_code")
        is_valid, err_resp = valid_dates(start_time, end_time, state_code)
        if not is_valid:
            return make_response(jsonify(err_resp), 400)
        news = get_news_per_state(start_time, end_time, state_code)
        resp = {
            "news": news,
            "status": "Success",
            "size": len(news)
        }
        return make_response(jsonify(resp), 200)
    except Exception as ex:
        traceback.print_exc()
        return make_response(jsonify({"status": "Failure", "message": "Internal Server Error"}), 500)


@app.route(f"{base_route}/search", methods=["GET"])
@cross_origin()
def search_news():
    try:
        start_time = request.args.get("start_time")
        end_time = request.args.get("end_time")
        search_phrase = request.args.get("search_phrase")
        news = search_news_in_range(start_time, end_time, search_phrase)
        resp = {
            "news": news,
            "status": "Success",
            "size": len(news)
        }
        return make_response(jsonify(resp), 200)
    except Exception as ex:
        traceback.print_exc()
        return make_response(jsonify({"status": "Failure", "message": "Internal Server Error"}), 500)


@app.route(f"{base_route}/count", methods=["GET"])
@cross_origin()
def get_count():
    try:
        date = request.args.get("date")
        is_valid, err_resp = valid_date_format(date)
        if not is_valid:
            return make_response(jsonify(err_resp), 400)
        news_count = get_state_news_count(date)
        resp = {
            # "news": news,
            "status": "Success"
        }
        return make_response(jsonify(news_count), 200)
    except Exception as ex:
        traceback.print_exc()
        return make_response(jsonify({"status": "Failure", "message": "Internal Server Error"}), 500)

if __name__ == "__main__":
    app.run(port=config.PORT, host=config.HOST)