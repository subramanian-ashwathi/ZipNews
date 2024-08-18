import config
import traceback
from datetime import datetime, timedelta

def valid_date_format(date):
    try:
        _ = datetime.strptime(date, config.DATE_FORMAT.split()[0])
        return True, None
    except ValueError:
        print("Invalid dates")
        traceback.print_exc()
        return False, {"status": "Failure", "message": "Invalid date format"}

def valid_dates(start_date, end_date, state_code):
    if not start_date and not end_date and not state_code:
        return False, {"status": "Failure", "message": "start date, end date, and state code are required fields"}
    try:
        start_time = datetime.strptime(start_date, config.DATE_FORMAT)
        end_time = datetime.strptime(end_date, config.DATE_FORMAT)
        if end_time <= start_time:
            return False, {"status": "Failure", "message": "start date must be before end date"}
        if (end_time-start_time) > timedelta(hours=(config.NEWS_WINDOW * 24)):
            return False, {"status": "Failure", "message": f"start date and end date must be within {config.NEWS_WINDOW} day(s) of each other"}
        return True, None
    except ValueError:
        print("Invalid dates")
        return False, {"status": "Failure", "message": "Invalid date format"}