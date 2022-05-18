import json
import boto3
import datetime
from requests_aws4auth import AWS4Auth
import requests
import logging
import time

def detect_text(photo, bucket, client, badwords):
    time.sleep(3)
    try:
        response = client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':photo}},Filters={'WordFilter': {'MinConfidence': 80}})
        textDetections=response['TextDetections']
        print ('Detected text\n----------')
        for text in textDetections:
            if text['DetectedText'].lower() in badwords:
                return True
            # print ('Detected text:' + text['DetectedText'])
            # print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
            # print ('Id: {}'.format(text['Id']))
            # if 'ParentId' in text:
            #     print ('Parent Id: {}'.format(text['ParentId']))
            # print ('Type:' + text['Type'])
            # print() 
        return False
    except:
        time.sleep(2)
        response = client.detect_text(Image={'S3Object':{'Bucket':bucket,'Name':photo}},Filters={'WordFilter': {'MinConfidence': 80}})
        textDetections=response['TextDetections']
        print ('Detected text\n----------')
        for text in textDetections:
            if text['DetectedText'].lower() in badwords:
                return True
            # print ('Detected text:' + text['DetectedText'])
            # print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
            # print ('Id: {}'.format(text['Id']))
            # if 'ParentId' in text:
            #     print ('Parent Id: {}'.format(text['ParentId']))
            # print ('Type:' + text['Type'])
            # print() 
        return False


class RekognitionImage:
    """
    Encapsulates an Amazon Rekognition image. This class is a thin wrapper
    around parts of the Boto3 Amazon Rekognition API.
    """
    def __init__(self, image, image_name, rekognition_client):
        """
        Initializes the image object.
    
        :param image: Data that defines the image, either the image bytes or
                      an Amazon S3 bucket and object key.
        :param image_name: The name of the image.
        :param rekognition_client: A Boto3 Rekognition client.
        """
        self.image = image
        self.image_name = image_name
        self.rekognition_client = rekognition_client
    
    def detect_moderation_labels(self):
        """
        Detects moderation labels in the image. Moderation labels identify content
        that may be inappropriate for some audiences.
    
        :return: The list of moderation labels found in the image.
        """
        logger = logging.getLogger()
        try:
            response = self.rekognition_client.detect_moderation_labels(Image=self.image,MinConfidence=80)
            labels = [label['Name'] for label in response['ModerationLabels']]
            logger.info("Found %s moderation labels in %s.", len(labels), self.image_name)
        except:
            logger.exception("Couldn't detect moderation labels in %s.", self.image_name)
            raise
        else:
            return labels




def lambda_handler(event, context):
    
    # This lambda gets called when a user wants to post a review/comment.
    # It will post the data to OpenSearch and Dynamo after doing some preporocessing. 
    e1 = event['userReview']
    print(e1)
    
    # Any photo should be uploaded immediately prior to this lambda, photo key (if a photo was uploaded) should be 
    # passed to this lambda. 
    
    # Get the bucket/unique key
    photo = e1['userImage']
    createdTimestamp = str(datetime.datetime.now())
    unique_key = e1['user'] + e1['address']['line1'] + e1['address']['zip'] + e1['userImage'] + createdTimestamp
    print(unique_key)
    bucket_name = 'power-renter-user-photos'
    
    #----------- Examine the photo in rekognition to get see if it should be flagged for moderation ------------
    
    # Get list of bad words to check against
    badwords = []
    with open('badtext.txt','r') as badtext:
        for line in badtext:
            badwords = line.rstrip().split(', ') #using rstrip to remove the \n
    
    # Check for inappropriate text in photo
    rek_client = boto3.client('rekognition')
    photo_text_is_inappropriate = detect_text(photo,bucket_name,rek_client,badwords)
    print("photo_text_is_inappropriate is: ")
    print(photo_text_is_inappropriate)
    
    if photo_text_is_inappropriate:
        return {
            'statusCode': 403,
            'body': json.dumps('There was text in the photo that was inappropriate.')
        }

    # Check for content in photo
    rek_image = RekognitionImage({'S3Object':{'Bucket':bucket_name,'Name':photo}},photo,rek_client)
    mod_labels = rek_image.detect_moderation_labels()
    print(mod_labels)
    
    photo_is_inappropriate = False
    
    if len(mod_labels) > 0:
        photo_is_inappropriate = True
        
    print("photo_is_inappropriate is: ")
    print(photo_is_inappropriate)
    
    if photo_is_inappropriate:
        return {
            'statusCode': 403,
            'body': json.dumps('The photo was inappropriate.')
        }
    
    # ----------- Verify Address in Location services ----------------------------------
    loc_services = boto3.client('location')
    # There are two options to resolve an address: search_place_index_for_suggestions or search_place_index_for_text
    # I think we should use search_place_index_for_suggestions in case people spell wrong?
    
    user_address = e1['address']['line1'] + e1['address']['line2'] + e1['address']['city'] + e1['address']['state'] + e1['address']['zip']
    print(user_address)
    addr_response = loc_services.search_place_index_for_text(
        FilterBBox=[-74.044737, 40.566965, -73.650135, 40.900062],
        FilterCountries=['USA'],
        IndexName='explore.place',
        Language='en',
        MaxResults=1,
        Text=user_address
    )
    print(addr_response)
    final_addr = addr_response['Results'][0]['Place']
    street_addr = final_addr['Label']
    coordinates = final_addr['Geometry']['Point']
    street_addr_line1 = final_addr["AddressNumber"] + ' ' + final_addr["Street"]
    postal_code = final_addr["PostalCode"]
    try:
        neighborhood = final_addr['Neighborhood']
    except:
        neighborhood = ''
        print("No Neighborhood.")
    borough = final_addr['Municipality']
    
    print('Resolved Address is: ')
    print(street_addr)
    print(final_addr)
    
    # ----------- Create the resource to store in ES ----------------------------------
    es_json_obj = {'objectKey': unique_key,
                  'bucket': bucket_name,
                  'createdTimestamp': createdTimestamp,
                  'userReview': e1,
                  'coordinates': coordinates,
                  'address': street_addr,
                  'addrLine1': street_addr_line1,
                  'zip': postal_code,
                  'neighborhood': neighborhood
    }
    print(es_json_obj)
    
    #------------------- Post to Elastic Search ----------------------------------
    region = 'us-east-1' # For example, us-west-1
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    host = 'https://search-user-reviews-7sbz7pu2pjevsriini57paxf4i.us-east-1.es.amazonaws.com' # The OpenSearch domain endpoint with https://
    index = 'reviews'
    url = host + '/' + index + '/_doc/'
     
    es_client = boto3.client('opensearch')

    # Make the signed HTTP request to put the data in Elastic Search
    es_result = requests.post(url, auth=("user-reviews", "PlentyGrapesFork2*"), json=es_json_obj)
    print(es_result)

    # ----------- Create the resource to store in Dynamo ------------------
    dynamo_item = {
        'review-id': {
                'S': unique_key,
        },
        'userId': {
                'S': e1['user'],
        },
        'addr_text': {
                'S': street_addr,
        },
        'house_number': {
                'N': final_addr['AddressNumber'],
        },
        'street': {
            'S': final_addr['Street'],
        },
        'zip': {
            'N': final_addr['PostalCode'][:5],
        },
        'state': {
            'S': final_addr['Region'],
        },
        'country': {
            'S': final_addr['Country'],
        },
        'borough': {
            'S': borough,
        },
        'latitude': {
            'S': str(coordinates[0]),
        },
        'longitude': {
            'S': str(coordinates[1]),
        },
        'neighborhood': {
            'S': neighborhood,
        },
        'createdTimestamp': {
            'S': createdTimestamp,
        },
        'comment': {
            'S': e1['comment'],
        },
        'userImage': {
            'S': 'https://power-renter-user-photos.s3.amazonaws.com/' + photo,
        },
        'rating': {
            'S': str(e1['rating'])
        }
    }
    
    print("Sending the following to dynamo: ")
    print(dynamo_item)
    
    #------------------- Post to Dynamo ----------------------------------    
    dyn_client = boto3.client('dynamodb')
    dyn_response = dyn_client.put_item(
        TableName='user-reviews',
        Item=dynamo_item
    )
    
    print(dyn_response)
    
    if dyn_response['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'statusCode': 400,
            'body': json.dumps('Could not post to DynamoDB.')
        }
 
    #------------------- Return Results ----------------------------------
    return {
        'statusCode': 200,
        'body': json.dumps('Sucessfully completed request.')
    }