import React from 'react'
import { Helmet } from 'react-helmet'
import { withAuthenticator } from '@aws-amplify/ui-react';
import Navigation from '../components/navigation'
import Row from '../components/row'
import Comments from '../components/comments'
import Rating from '../components/rating'
import Upload from '../components/upload'
import Footer from '../components/footer'
import './add-review.css'


const AddReview = (props) => {
  return (
    <div className="add-review-container">
      <Helmet>
        <title>Add Review - Creative Agency Page</title>
        <meta property="og:title" content="Add Review - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name3"></Navigation>
      <div className="add-review-container1">
        <h1 className="add-review-text">Add A Review</h1>
        <form className="add-review-form">
          <div className="add-review-container2">
            <div className="add-review-container3">
              <span className="add-review-text1">Address</span>
            </div>
            <Row
              text1="Address Line 1"
              rootClassName="row-root-class-name"
              textinput_placeholder="23 Main St"
            ></Row>
            <Row
              text1="Address Line 2"
              rootClassName="row-root-class-name1"
              textinput_placeholder="Apt 6"
            ></Row>
            <Row
              text1="City"
              rootClassName="row-root-class-name2"
              textinput_placeholder="Brooklyn"
            ></Row>
            <Row
              text1="State"
              rootClassName="row-root-class-name3"
              textinput_placeholder="NY"
            ></Row>
            <Row
              text1="Zip"
              rootClassName="row-root-class-name4"
              textinput_placeholder="11226"
            ></Row>
            <div className="add-review-container4">
              <span className="add-review-text2">Review</span>
            </div>
            <Comments
              rootClassName="comments-root-class-name"
              textarea_placeholder="Enter comments or complaints here."
            ></Comments>
            <Rating rootClassName="rating-root-class-name"></Rating>
            <Upload rootClassName="upload-root-class-name"></Upload>
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
      </div>
      <Footer rootClassName="footer-root-class-name3"></Footer>
    </div>
  ) 
}

export default withAuthenticator(AddReview)
