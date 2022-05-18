import json
import boto3
import requests
import logging
import os
import time
from open_data_api import Open_Data_Query
from hash_tables import neighborhoods, violation_descriptions

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

MSTR_USER = os.environ['MSTR_USER']
MSTR_PW = os.environ['MSTR_PW']
ACCESS_KEY = os.environ['ACCESS_KEY']
SECRET_KEY = os.environ['SECRET_KEY']
REGION = os.environ['REGION']


def get_new_violations():
    open_data_object = Open_Data_Query()
    open_data_housing_violation = open_data_object.housing_violation_query()
    return open_data_housing_violation


def upload_new_violations(violations):
    dynamodb = boto3.resource('dynamodb', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)
    table = dynamodb.Table('housing-violation')

    for violation in violations:
        violation_description = violation_descriptions[violation.get('ordernumber', '')]
        table.put_item(
            Item = {
                    'violation_id': violation.get('violationid', ''),
                    'building_id': violation.get('buildingid', ''),
                    'registration_id': violation.get('registrationid', ''),
                    'boro_id': violation.get('boroid', ''),
                    'borough': violation.get('borough', ''),
                    'house_number': violation.get('housenumber', ''),
                    'low_house_number': violation.get('lowhousenumber', ''),
                    'high_house_number': violation.get('highhousenumber', ''),
                    'street_name': violation.get('streetname', ''),
                    'street_code': violation.get('streetcode', ''),
                    'postcode': violation.get('zip', ''),
                    'apartment': violation.get('apartment', ''),
                    'story': violation.get('story', ''),
                    'block': violation.get('block', ''),
                    'lot': violation.get('lot', ''),
                    'class': violation.get('class', ''),
                    'inspection_date': violation.get('inspectiondate', ''),
                    'approved_date': violation.get('approveddate', ''),
                    'original_certify_by_date': violation.get('originalcertifybydate', ''),
                    'original_correct_by_date': violation.get('originalcorrectbydate', ''),
                    'new_certify_by_date': violation.get('newcertifybydate', ''),
                    'new_correct_by_date': violation.get('newcorrectbydate', ''),
                    'certified_date': violation.get('certifieddate', ''),
                    'order_number': violation.get('ordernumber', ''),
                    'novid': violation.get('novid', ''),
                    'nov_description': violation.get('novdescription', ''),
                    'nov_issued_date': violation.get('novissueddate', ''),
                    'current_status_id': violation.get('currentstatusid', ''),
                    'current_status': violation.get('currentstatus', ''),
                    'current_status_date': violation.get('currentstatusdate', ''),
                    'nov_type': violation.get('novtype', ''),
                    'violation_status': violation.get('violationstatus', ''),
                    'rent_impairing': violation.get('rentimpairing', ''),
                    'latitude': violation.get('latitude', ''),
                    'longitude': violation.get('longitude', ''),
                    'community_board': violation.get('communityboard', ''),
                    'council_district': violation.get('councildistrict', ''),
                    'census_tract': violation.get('censustract', ''),
                    'bin': violation.get('bin', ''),
                    'bbl': violation.get('bbl', ''),
                    'nta': violation.get('nta', ''),
                    'violation_description': violation_description
                    }
                )


def index_new_violations(violations):
    os.chdir('/tmp')
    with open('os_upload_v.json', 'w') as file_write:
        for violation in violations:
            outputOne = { "index": { "_index": "violation_id", "_id": violation.get('violationid', '') } }
            file_write.write(json.dumps(outputOne) + "\n")

            # create street address
            _address = violation.get('housenumber', '') + " " + \
                    violation.get('streetname', '') + " " + \
                    violation.get('zip', '')
            if _address.isspace():
                _address = ""

            # get neighborhood
            _neighborhood = neighborhoods[violation.get('zip', '')]
            
            outputTwo = { 'address': _address, 
                        'neighborhood': _neighborhood, 
                        'coordinates': {
                            'latitude': violation.get('latitude', ''), 
                            'longitude': violation.get('longitude', '')
                            }
                        }
                        
            file_write.write(json.dumps(outputTwo) + "\n")

    with open('os_upload_v.json', 'r') as file_read:
        data = file_read.read()
        logger.debug("housing violations data={}".format(data))
        url = 'https://search-search-housing-violations-bcef5blvgaanh3whheoy4k264m.us-east-1.es.amazonaws.com/violation_id/_bulk?pretty'
        headers = {'Content-Type': 'application/json'}
        response = requests.put(url, auth=(MSTR_USER, MSTR_PW), data=data, headers=headers)
        
        file_write.close()
        file_read.close()
        os.remove(file_write.name)
        return response


def get_new_complaints():
    open_data_object = Open_Data_Query()
    open_data_threeoneone = open_data_object.three_one_one_query()
    return open_data_threeoneone


def upload_new_complaints(complaints):
    dynamodb = boto3.resource('dynamodb', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name=REGION)
    table = dynamodb.Table('311-complaints')

    for complaint in complaints:
        table.put_item(
            Item = {
                    'unique_key': complaint.get('unique_key', ''),
                    'created_date': complaint.get('created_date', ''),
                    'closed_date': complaint.get('closed_date', ''),
                    'agency': complaint.get('agency', ''),
                    'agency_name': complaint.get('agency_name', ''),
                    'complaint_type': complaint.get('complaint_type', ''),
                    'descriptor': complaint.get('descriptor', ''),
                    'location_type': complaint.get('location_type', ''),
                    'incident_zip': complaint.get('incident_zip', ''),
                    'incident_address': complaint.get('incident_address', ''),
                    'street_name': complaint.get('street_name', ''),
                    'cross_street_1': complaint.get('cross_street_1', ''),
                    'cross_street_2': complaint.get('cross_street_2', ''),
                    'intersection_street_1': complaint.get('intersection_street_1', ''),
                    'intersection_street_2': complaint.get('intersection_street_2', ''),
                    'address_type': complaint.get('address_type', ''),
                    'city': complaint.get('city', ''),
                    'landmark': complaint.get('landmark', ''),
                    'facility_type': complaint.get('facility_type', ''),
                    'status': complaint.get('status', ''),
                    'due_date': complaint.get('due_date', ''),
                    'resolution_description': complaint.get('resolution_description', ''),
                    'resolution_action_updated_date': complaint.get('resolution_action_updated_date', ''),
                    'community_board': complaint.get('community_board', ''),
                    'bbl': complaint.get('bbl', ''),
                    'borough': complaint.get('borough', ''),
                    'open_data_channel_type': complaint.get('open_data_channel_type', ''),
                    'park_facility_name': complaint.get('park_facility_name', ''),
                    'park_borough': complaint.get('park_borough', ''),
                    'vehicle_type': complaint.get('vehicle_type', ''),
                    'taxi_company_borough': complaint.get('taxi_company_borough', ''),
                    'taxi_pick_up_location': complaint.get('taxi_pick_up_location', ''),
                    'bridge_highway_name': complaint.get('bridge_highway_name', ''),
                    'bridge_highway_direction': complaint.get('bridge_highway_direction', ''),
                    'road_ramp': complaint.get('road_ramp', ''),
                    'bridge_highway_segment': complaint.get('bridge_highway_segment', ''),
                    'latitude': complaint.get('latitude', ''),
                    'longitude': complaint.get('longitude', ''),
                    'location': complaint.get('location', ''),
                    }
                )


def index_new_complaints(complaints):
    os.chdir('/tmp')
    with open('os_upload_c.json', 'w') as file_write:
        for complaint in complaints:
            outputOne = { "index": { "_index": "unique_key", "_id": complaint.get('unique_key', '') } }
            file_write.write(json.dumps(outputOne) + "\n")

            # create street address
            _address = complaint.get('incident_address', '') + " " + \
                    complaint.get('city', '') + " " + \
                    complaint.get('incident_zip', '')
            if _address.isspace():
                _address = ""

            # get neighborhood
            _neighborhood = neighborhoods[complaint.get('incident_zip', '')]
            
            outputTwo = { 'address': _address, 
                        'neighborhood': _neighborhood, 
                        'coordinates': {
                            'latitude': complaint.get('latitude', ''), 
                            'longitude': complaint.get('longitude', '')
                            }
                        }
                        
            file_write.write(json.dumps(outputTwo) + "\n")

    with open('os_upload_c.json', 'r') as file_read:
        data = file_read.read()
        logger.debug("311 complaints data={}".format(data))
        url = 'https://search-search-311-complaints-svvqh2pacd3ytuzpdl32jswhbm.us-east-1.es.amazonaws.com/unique_key/_bulk?pretty'
        headers = {'Content-Type': 'application/json'}
        response = requests.put(url, auth=(MSTR_USER, MSTR_PW), data=data, headers=headers)
        
        file_write.close()
        file_read.close()
        os.remove(file_write.name)
        return response


def lambda_handler(event, context):
    response_c = response_v = 'empty_list'
    
    complaints_list = get_new_complaints()
    if complaints_list:
        upload_new_complaints(complaints_list)
        response_c = index_new_complaints(complaints_list)
        logger.debug("311 complaints OpenSearch indexing response={}".format(response_c))
    
    time.sleep(300) # alleviate exceeding api quota and opensearch bulk upload rate
    
    violations_list = get_new_violations()
    if violations_list:
        upload_new_violations(violations_list)
        response_v = index_new_violations(violations_list)
        logger.debug("Housing violations OpenSearch indexing response={}".format(response_v))
    
    response = "response_c:" + str(response_c) + " response_v:" + str(response_v)
    logger.debug("response={}".format(response))
    
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
