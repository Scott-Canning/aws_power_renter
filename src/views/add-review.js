import React from 'react'
import { Helmet } from 'react-helmet'
import { withAuthenticator } from '@aws-amplify/ui-react';
import Navigation from '../components/navigation'
import Row from '../components/row'
import Comments from '../components/comments'
import Rating from '../components/rating'
import Upload from '../components/upload'
import Footer from '../components/footer'
import { useState } from "react"
import AWS from 'aws-sdk'
import './add-review.css'
import { Auth } from 'aws-amplify'

const S3_BUCKET ='power-renter-user-photos';
const REGION ='us-east-1';
var username = ""

Auth.currentAuthenticatedUser().then((user) => {
  // console.log('username = ' + user.username);
  username = user.username
});

// Currently using the power renter map unautharized identity, this should maybe be updated?
AWS.config.update({
  region: REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:a95d1dad-aef6-4d50-973a-a25452ffc607',
  })
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const AddReview = (props) => {
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress , setProgress] = useState(0);
  const [apiResponse , setApiResponse] = useState("");
  const [loadingStarted , setLoadingStarted] = useState(false);
  const [loadingDone , setLoadingDone] = useState(false);


  function uploadPhoto(params) {
    myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100))
    })
    .send((err) => {
      if (err){
        console.log(err)
      }
    })
    return(true);
  };

  // async function uploadPhoto(params) {
  // }
  function sendToApiGateWay(file){

    const review_body = {
      userReview: {
        user: username,
        comment: comments,
        rating: rating,
        address: {
          line1: addr1,
          line2: addr2,
          city: city,
          state: state,
          zip: zip
        },
        userImage: file.name
      }
    };

    console.log(review_body);

    window.sdk.uploadPut({}, review_body, {})
      .then(response => {
        console.log(response);
        setApiResponse(response['data']['body']);
        //console.log(response.data);
        //setLoading(false);
      })
      .catch(error => {
        console.log(
          "Encountered an error when posting data",
          error
        );
        setApiResponse("There was an issue posting data to the server. Please try again.")
      });

    setAddr1('');
    setAddr2('');
    setCity('');
    setState('');
    setZip('');
    setComments('');
    setRating('');
    setSelectedFile('');
    setProgress(0);
    setLoadingDone(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const uploadFile = (file) => {
    const params = {
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name,
      };
    
    console.log(params);
    setLoadingStarted(true);
    setTimeout(sendToApiGateWay(file),5000);

    uploadPhoto(params);
  } 

  const handleSubmit = (event) => {
    event.preventDefault();
    uploadFile(selectedFile);
    //alert(`The address1 you entered was: ${apiResponse}`)
  }
//<div class="loader-spinner"></div>
  return (
    <div className="add-review-container">
      <Helmet>
        <title>Add Review - Creative Agency Page</title>
        <meta property="og:title" content="Add Review - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name3"></Navigation>
      <div className="add-review-container1">
      <h1 className="add-review-text">Add A Review</h1>
      
      <div>
      {loadingDone==false && loadingStarted == false ? 

        <form className="add-review-form" onSubmit={handleSubmit}>
          <div className="add-review-container2">
            <div className="add-review-container3">
              <span className="add-review-text1">Address</span>
            </div>
            <Row
              text1="Address Line 1"
              rootClassName="row-root-class-name"
              textinput_placeholder="23 Main St"
              userVal={addr1}
              setVal={setAddr1}
            ></Row>
            <Row
              text1="Address Line 2"
              rootClassName="row-root-class-name1"
              textinput_placeholder="Apt 6"
              userVal={addr2}
              setVal={setAddr2}
            ></Row>
            <Row
              text1="City"
              rootClassName="row-root-class-name2"
              textinput_placeholder="Brooklyn"
              userVal={city}
              setVal={setCity}
            ></Row>
            <Row
              text1="State"
              rootClassName="row-root-class-name3"
              textinput_placeholder="NY"
              userVal={state}
              setVal={setState}
            ></Row>
            <Row
              text1="Zip"
              rootClassName="row-root-class-name4"
              textinput_placeholder="11226"
              userVal={zip}
              setVal={setZip}
            ></Row>
            <div className="add-review-container4">
              <span className="add-review-text2">Review</span>
            </div>
            <Comments
              rootClassName="comments-root-class-name"
              textarea_placeholder="Enter comments or complaints here."
              userVal={comments}
              setVal={setComments}
            ></Comments>
            <Rating rootClassName="rating-root-class-name"
                    userVal={rating}
                    setVal={setRating}
            ></Rating>
            <Upload rootClassName="upload-root-class-name"
                    userVal={selectedFile}
                    setVal={setSelectedFile}
            ></Upload>
            
            
            <button className="add-review-button button">
              <span className="add-review-text3 button-primary button">
                Submit
              </span>
            </button>

            <div className="add-review-container5">
              <a
                href="https://portal.311.nyc.gov/report-problems/"
                target="_blank"
                rel="noreferrer noopener"
                className="add-review-link"
              >
                <span>
                  Click here
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </a>
              <span>
                {' '}
                to submit a formal complaint with the city of New York.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
            </div>
          </div>
        </form>

        : apiResponse ? <div>
                              <div align="center"><h2>{apiResponse}</h2></div>
                              <div className="add-review-container5" align="center">Please reload the page to make another review.</div>
                              </div>: <div>
                              <div className="loader-spinner"></div></div>} </div>
        
      </div>
      <Footer rootClassName="footer-root-class-name3"></Footer>
    </div>
  ) 
}

export default withAuthenticator(AddReview)
//<div>File Upload Progress is {progress}%</div>