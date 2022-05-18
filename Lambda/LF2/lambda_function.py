import json
import requests 
import boto3
from requests_aws4auth import AWS4Auth
import time
import random
import logging
# logger = logging.getLogger()
# logger.setLevel(logging.DEBUG)

def getCoordinates(query):
    location = boto3.client('location')
    response = location.search_place_index_for_text(
    	IndexName = "explore.place",
    	FilterBBox = [-74.044737, 40.566965, -73.650135, 40.900062],
    	MaxResults = 1,
    	Language='en',
    	FilterCountries=['USA'],
    	Text = query
    	)
    r = response["Results"]
    # lattitude = r[0]["Place"]["Geometry"]["Point"][1]
    # longitude = r[0]["Place"]["Geometry"]["Point"][0]
    return r

def userAddressSearch(response):
    apartment = {}
    latitude = response[0]["Place"]["Geometry"]["Point"][1]
    longitude = response[0]["Place"]["Geometry"]["Point"][0]
    streetAddress = response[0]["Place"]["AddressNumber"] + ' ' + response[0]["Place"]["Street"]
    streetAddressLabel = response[0]["Place"]["Label"]
    print('Address from location services is:',response[0]["Place"])
    address = {'city': response[0]["Place"]["Municipality"],
              'neighborhood': None,
              'state': response[0]["Place"]["Region"],
              'streetAddress': streetAddress,
              'streetAddressLabel': streetAddressLabel,
              'zipcode': response[0]["Place"]["PostalCode"]}
    
    
    apartment = {'price': None,
                 'longitude':longitude,
                 'latitude':latitude,
                 'bedrooms':None, 
                 'bathrooms': None, 
                 'description':None, 
                 'address':address, 
                 'imgSrc':None, 
                 'reviews':None, 
                 'violations':None, 
                 'complaints':None,
    }
    
    return [apartment]
 
    
    
def zillowCoordinatesSearch(response):
    latitude = response[0]["Place"]["Geometry"]["Point"][1]
    longitude = response[0]["Place"]["Geometry"]["Point"][0]
    
    url = "https://zillow-com1.p.rapidapi.com/propertyByCoordinates"
    querystring = {"lat":latitude,"long":longitude,"d":"0.25","includeSold":"false"}
    headers = {
    	"X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
    	"X-RapidAPI-Key": "3c35a694b7mshfe31e9eb65406e7p1531b4jsnd431c5954708"
    }
    response = requests.request("GET", url, headers=headers, params=querystring)
    apartments = json.loads(response.content.decode('utf-8'))
    for_rent_listings = []
    for apartment in apartments:
        data = apartment.get('property')
        if data != None:
            if data['homeStatus'] == "FOR_RENT":
                for_rent_listings.append(data["zpid"])
    return for_rent_listings 

def zillowApartmentDetails(apartment_list):
    if len(apartment_list) > 10:
        temp = random.sample(apartment_list, 10)
        apartment_list = temp
    
    search_results = []
    worth = '2097420005'
    
    for zpid in apartment_list:
        url = "https://zillow-com1.p.rapidapi.com/property"
        querystring = {"zpid": zpid}
        headers = {
            "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
            "X-RapidAPI-Key": "3c35a694b7mshfe31e9eb65406e7p1531b4jsnd431c5954708"
        }
        response = requests.request("GET", url, headers=headers, params=querystring)
        apt_details = json.loads(response.content.decode('utf-8'))
        wanted_keys = ['price', 'latitude', 'longitude', 'bedrooms', 'bathrooms', 'description', 'address', 'imgSrc', 'url'] 
        apartment = dict((k, apt_details[k]) for k in wanted_keys if k in apt_details)
        if apartment['url'] != "":
            full_url = 'https://zillow.com' + apartment['url']
            apartment["url"] = full_url
        apartment["reviews"] = None
        apartment["violations"] = None
        apartment["complaints"] = None
        search_results.append(apartment)
        time.sleep(0.75)
    return search_results


def parseOsSearch(apartment_list):
    streets = {'allee', 'alley', 'ally', 'aly', 'anex', 'annex', 'annx', 'anx', 'arc', 'arcade', 'av', 'ave', 'aven', 'avenu', 'avenue', 'avn', 'avnue', 'bayoo', 'bayou', 'bch', 'beach', 'bend', 'bnd', 'blf', 'bluf', 'bluff', 'bluffs', 'bot', 'btm', 'bottm', 'bottom', 'blvd', 'boul', 'boulevard', 'boulv', 'br', 'brnch', 'branch', 'brdge', 'brg', 'bridge', 'brk', 'brook', 'brooks', 'burg', 'burgs', 'byp', 'bypa', 'bypas', 'bypass', 'byps', 
    'camp', 'cp', 'cmp', 'canyn', 'canyon', 'cnyn', 'cape', 'cpe', 'causeway', 'causwa', 'cswy', 'cen', 'cent', 'center', 'centr', 'centre', 'cnter', 'cntr', 'ctr', 'centers', 'cir', 'circ', 'circl', 'circle', 'crcl', 'crcle', 'circles', 'clf', 'cliff', 'clfs', 'cliffs', 'clb', 'club', 'common', 'commons', 'cor', 'corner', 'corners', 'cors', 'course', 'crse', 'court', 'ct', 'courts', 'cts', 'cove', 'cv', 'coves', 'creek', 'crk', 'crescent', 
    'cres', 'crsent', 'crsnt', 'crest', 'crossing', 'crssng', 'xing', 'crossroad', 'crossroads', 'curve', 'dale', 'dl', 'dam', 'dm', 'div', 'divide', 'dv', 'dvd', 'dr', 'driv', 'drive', 'drv', 'drives', 'est', 'estate', 'estates', 'ests', 'exp', 'expr', 'express', 'expressway', 'expw', 'expy', 'ext', 'extension', 'extn', 'extnsn', 'exts', 'fall', 'falls', 'fls', 'ferry', 'frry', 'fry', 'field', 'fld', 'fields', 'flds', 'flat', 'flt', 'flats', 
    'flts', 'ford', 'frd', 'fords', 'forest', 'forests', 'frst', 'forg', 'forge', 'frg', 'forges', 'fork', 'frk', 'forks', 'frks', 'fort', 'frt', 'ft', 'freeway', 'freewy', 'frway', 'frwy', 'fwy', 'garden', 'gardn', 'grden', 'grdn', 'gardens', 'gdns', 'grdns', 'gateway', 'gatewy', 'gatway', 'gtway', 'gtwy', 'glen', 'gln', 'glens', 'green', 'grn', 'greens', 'grov', 'grove', 'grv', 'groves', 'harb', 'harbor', 'harbr', 'hbr', 'hrbor', 'harbors', 
    'haven', 'hvn', 'ht', 'hts', 'highway', 'highwy', 'hiway', 'hiwy', 'hway', 'hwy', 'hill', 'hl', 'hills', 'hls', 'hllw', 'hollow', 'hollows', 'holw', 'holws', 'inlt', 'is', 'island', 'islnd', 'islands', 'islnds', 'iss', 'isle', 'isles', 'jct', 'jction', 'jctn', 'junction', 'junctn', 'juncton', 'jctns', 'jcts', 'junctions', 'key', 'ky', 'keys', 'kys', 'knl', 'knol', 'knoll', 'knls', 'knolls', 'lk', 'lake', 'lks', 'lakes', 'land', 'landing', 
    'lndg', 'lndng', 'lane', 'ln', 'lgt', 'light', 'lights', 'lf', 'loaf', 'lck', 'lock', 'lcks', 'locks', 'ldg', 'ldge', 'lodg', 'lodge', 'loop', 'loops', 'mall', 'mnr', 'manor', 'manors', 'mnrs', 'meadow', 'mdw', 'mdws', 'meadows', 'medows', 'mews', 'mill', 'mills', 'missn', 'mssn', 'motorway', 'mnt', 'mt', 'mount', 'mntain', 'mntn', 'mountain', 'mountin', 'mtin', 'mtn', 'mntns', 'mountains', 'nck', 'neck', 'orch', 'orchard', 'orchrd', 'oval', 
    'ovl', 'overpass', 'park', 'prk', 'parks', 'parkway', 'parkwy', 'pkway', 'pkwy', 'pky', 'parkways', 'pkwys', 'pass', 'passage', 'path', 'paths', 'pike', 'pikes', 'pine', 'pines', 'pnes', 'pl', 'plain', 'pln', 'plains', 'plns', 'plaza', 'plz', 'plza', 'point', 'pt', 'points', 'pts', 'port', 'prt', 'ports', 'prts', 'pr', 'prairie', 'prr', 'rad', 'radial', 'radiel', 'radl', 'ramp', 'ranch', 'ranches', 'rnch', 'rnchs', 'rapid', 'rpd', 'rapids', 
    'rpds', 'rest', 'rst', 'rdg', 'rdge', 'ridge', 'rdgs', 'ridges', 'riv', 'river', 'rvr', 'rivr', 'rd', 'road', 'roads', 'rds', 'route', 'row', 'rue', 'run', 'shl', 'shoal', 'shls', 'shoals', 'shoar', 'shore', 'shr', 'shoars', 'shores', 'shrs', 'skyway', 'spg', 'spng', 'spring', 'sprng', 'spgs', 'spngs', 'springs', 'sprngs', 'spur', 'spurs', 'sq', 'sqr', 'sqre', 'squ', 'square', 'sqrs', 'squares', 'sta', 'station', 'statn', 'stn', 'stra', 'strav', 
    'straven', 'stravenue', 'stravn', 'strvn', 'strvnue', 'stream', 'streme', 'strm', 'street', 'strt', 'st', 'str', 'streets', 'smt', 'sumit', 'sumitt', 'summit', 'ter', 'terr', 'terrace', 'throughway', 'trace', 'traces', 'trce', 'track', 'tracks', 'trak', 'trk', 'trks', 'trafficway', 'trail', 'trails', 'trl', 'trls', 'trailer', 'trlr', 'trlrs', 'tunel', 'tunl', 'tunls', 'tunnel', 'tunnels', 'tunnl', 'trnpk', 'turnpike', 'turnpk', 'underpass', 'un', 
    'union', 'unions', 'valley', 'vally', 'vlly', 'vly', 'valleys', 'vlys', 'vdct', 'via', 'viadct', 'viaduct', 'view', 'vw', 'views', 'vws', 'vill', 'villag', 'village', 'villg', 'villiage', 'vlg', 'villages', 'vlgs', 'ville', 'vl', 'vis', 'vist', 'vista', 'vst', 'vsta', 'walk', 'walks', 'wall', 'wy', 'way', 'ways', 'well', 'wells', 'wls'}
    
    for apartment in apartment_list:
        street_addr = apartment["address"]["streetAddress"]
        print(street_addr)
        street_addr_split = (street_addr.replace(',', ' ').lower()).split(' ')
        end_of_line1_index = -1
        for i in range(0, len(street_addr_split)):
            if street_addr_split[i] in streets:
                end_of_line1_index = i
        if end_of_line1_index != -1:
            final_addr = ' '.join(street_addr_split[0:end_of_line1_index])
        else:
            final_addr = street_addr
        print(final_addr)
        apartment["search_address"] = final_addr
    
    return apartment_list
        
    
def getComplaints(apartment_list):
    dynamodb = boto3.client('dynamodb')
    service = 'es'
    region = 'us-east-1'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    host = 'https://search-search-311-complaints-svvqh2pacd3ytuzpdl32jswhbm.us-east-1.es.amazonaws.com'
    url = host + '/_search'
    for apartment in apartment_list:
        zipcode = apartment["address"]["zipcode"][:5]
        street_addr = apartment["search_address"]
        query = {
        "query": {
            "bool": {
              "must": [
                 {"match_phrase": {"address":  street_addr}},
                 {"match_phrase": {"address":  zipcode}}
                 ]       
                }
            }
        }
        headers = {"Content-Type": "application/json"}
        r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
        data = json.loads(r.content.decode('utf-8'))
        #print(data)
        dynamodb_search = []
        if data["hits"]["hits"] == None:
            complaints = []
        else:
            for i in data["hits"]["hits"]:
                dynamodb_search.append(i['_id'])
            
            complaints = []
            for complaint_id in dynamodb_search:
                details = {}
                data = dynamodb.get_item(
                    TableName='311-complaints',
                    Key={
                        'unique_key': {
                            'S': complaint_id
                        }
                    }
                )
                details["date"] = data["Item"]["created_date"]['S']
                details["desc"] = data["Item"]["descriptor"]['S']
                details["category"] = data["Item"]["complaint_type"]['S']
                details["status"] = data["Item"]["status"]['S']
                complaints.append(details)
                
        apartment["complaints"] = complaints
    
    return apartment_list
    
    
def getViolations(apartment_list):
    print("in_violations")
    dynamodb = boto3.client('dynamodb')
    service = 'es'
    region = 'us-east-1'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    host = 'https://search-search-housing-violations-bcef5blvgaanh3whheoy4k264m.us-east-1.es.amazonaws.com'
    url = host + '/_search'
    for apartment in apartment_list:
        print(apartment)
        print(apartment["address"]["zipcode"])
        # print(apartment["address"]["search_address"])
        zipcode = apartment["address"]["zipcode"][:5]
        street_addr = apartment["search_address"]
        query = {
        "query": {
            "bool": {
              "must": [
                 {"match_phrase": {"address":  street_addr}},
                 {"match_phrase": {"address":  zipcode}}
                 ]       
                }
            }
        }
        
        #                 {"match_phrase": {"address":  zipcode}}
        headers = {"Content-Type": "application/json"}
        r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
        data = json.loads(r.content.decode('utf-8'))
        print(data)
        
        # logger.debug("Violation data={}".format(data))

        dynamodb_search = []
        if data["hits"]["hits"] == None:
            violations = []
        else:
            for i in data["hits"]["hits"]:
                dynamodb_search.append(i['_id'])
            
            violations = []
            for violation_id in dynamodb_search:
                details = {}
                data = dynamodb.get_item(
                    TableName='housing-violations',
                    Key={
                        'violation_id': {
                            'S': violation_id
                        }
                    }
                )
                details["date"] = data["Item"]["nov_issued_date"]['S']
                details["desc"] = data["Item"]["violation_description"]['S']
                details["category"] = data["Item"]["order_number"]['S']
                details["status"] = data["Item"]["violation_status"]['S']
                details["apartment"] = data["Item"]["apartment"]['S']
                violations.append(details)
                
        apartment["violations"] = violations
    
    return apartment_list


def getReviews(apartment_list):
    dynamodb = boto3.client('dynamodb')
    service = 'es'
    region = 'us-east-1'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    host = 'https://search-user-reviews-7sbz7pu2pjevsriini57paxf4i.us-east-1.es.amazonaws.com'
    url = host + '/_search'
    for apartment in apartment_list:
        zipcode = apartment["address"]["zipcode"][:5]
        # print("getReviews - zipcode: ", zipcode)
        street_addr = apartment["search_address"]
        #apartment["address"]["streetAddress"]
        # print("getReviews - street_addr: ", street_addr)
        query = {
        "query": {
            "bool": {
              "must": [
                 {"match_phrase": {"addrLine1":  street_addr}},
                 {"match_phrase": {"zip":  zipcode}}
                 ]       
                }
            }
        }
        headers = {"Content-Type": "application/json"}
        r = requests.get(url, auth=("user-reviews", "PlentyGrapesFork2*"), headers=headers, data=json.dumps(query))
        data = json.loads(r.content.decode('utf-8'))
        #print(data)
        # print(data)
        dynamodb_search = []
        if data["hits"]["hits"] == None:
            reviews = []
        else:
            for i in data["hits"]["hits"]:
                dynamodb_search.append(i['_source']['objectKey'])
                
            reviews = []
            for review_id in dynamodb_search:
                details = {}
                # print(review_id)
                # print(type(review_id))
                data = dynamodb.get_item(
                    TableName='user-reviews',
                    Key={
                        'review-id': {
                            'S': review_id
                        }
                    }
                )
                details["comment"] = data["Item"]["comment"]['S']
                details["rating"] = data["Item"]["rating"]['S']
                details["userPhoto"] = {"url": data["Item"]["userImage"]['S']}
                details["user"] = data["Item"]["userId"]['S']
                details["timeStamp"] = data["Item"]["createdTimestamp"]['S'][0:16]
                
                reviews.append(details)
                
        apartment["reviews"] = reviews

    return apartment_list

def lambda_handler(event, context):
    print(event)
    user_query = event['q']
    #user_query = '20 avenue a, new york'
    skipZillow = event['skipZillow']
    apartments = []
    if skipZillow == '':
        response = getCoordinates(user_query)
        rent_listings = zillowCoordinatesSearch(response)
        # print(response)
        apartments = zillowApartmentDetails(rent_listings)
    else:
        response = getCoordinates(user_query)
        apartments = userAddressSearch(response)
        # print(response)
        

    print("apartments" + str(apartments))
    parse_apt = parseOsSearch(apartments)
    print("parse_apt" + str(parse_apt))
    
    add_complaint = getComplaints(parse_apt)
    
    add_violations = getViolations(add_complaint)
    add_reviews = getReviews(add_violations)
    

        
    response = {
        'isBase64Encoded': False,
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(add_reviews)
    }
    
    return response