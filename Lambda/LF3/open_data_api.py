from sodapy import Socrata
import json
import os
from datetime import datetime
from dateutil.relativedelta import relativedelta

OD_APP_TOKEN = os.environ['OD_APP_TOKEN']

class Open_Data_Query:

    def __init__(self):
        self.open_data_key = OD_APP_TOKEN
        self.client = Socrata("data.cityofnewyork.us", self.open_data_key)

    def three_one_one_query(self):
        date = datetime.now()
        date = date - relativedelta(days=+1)
        date = date.strftime('%Y-%m-%d')
        where_input = "(status= 'Open' or status= 'In Progress' )" \
                       " and (created_date >= '" + str(date) + "')"

        try:
            req = self.client.get("erm2-nwe9", where=where_input, order="created_date DESC")
            if req:
                return req
            else:
                return []
        except IndexError:
            return []


    def housing_violation_query(self):
        date = datetime.now()
        date = date - relativedelta(days=+1)
        date = date.strftime('%Y-%m-%d')
        where_input = "(violationstatus= 'Open')" \
                      " and (novissueddate >= '" + str(date) + "')"

        try:
            req = self.client.get("wvxf-dwi5", where=where_input, order="novissueddate DESC")
            if req:
                return req
            else:
                return []
        except IndexError:
            return []

