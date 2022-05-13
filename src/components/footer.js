import React from 'react'

import PropTypes from 'prop-types'

import './footer.css'

const Footer = (props) => {
  return (
    <div className={`section-container ${props.rootClassName} `}>
      <div className="max-content-container">
        <div className="footer-top-part">
          <div className="footer-links-container">
            <div className="footer-product-container">
              <span className="footer-text">{props.text1}</span>
              <span className="footer-text01">{props.text2}</span>
              <span className="footer-text02">{props.text3}</span>
              <span className="">{props.text4}</span>
            </div>
            <div className="footer-navigate-container">
              <span className="footer-text04">{props.text5}</span>
              <span className="footer-text05">{props.text6}</span>
              <span className="footer-text06">{props.text7}</span>
              <span className="">{props.text8}</span>
            </div>
            <div className="footer-contact-container">
              <span className="footer-text08">{props.text9}</span>
              <span className="footer-text09">
                <span className="">5 Metrotech Center,</span>
                <span className="">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <br className=""></br>
                <span className="">Brooklyn, NY 11226</span>
                <br className=""></br>
              </span>
            </div>
          </div>
          <div className="footer-subscribe-container">
            <span className="footer-text16">{props.text}</span>
            <input
              type="text"
              placeholder={props.textinput_placeholder}
              className="footer-textinput input"
            />
            <button className="button-primary button">{props.button}</button>
          </div>
        </div>
      </div>
      <div className="footer-separator"></div>
      <footer className="footer-max-width1 max-content-container">
        <span className="">{props.text10}</span>
        <span className="footer-text18">
          <span className="">All rights recived @ PowerRenter</span>
          <span className="">
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
        </span>
      </footer>
    </div>
  )
}

Footer.defaultProps = {
  rootClassName: '',
  text3: 'Search',
  text2: 'About',
  text1: 'Product',
  text9: 'Contact Us',
  text5: 'Navigate',
  button: 'Subscribe',
  text7: 'Sitemap',
  text6: 'Copyrights',
  text10: 'PowerRenter',
  textinput_placeholder: 'Enter your e-mail address',
  text: 'Subscribe to our tennant newsletter',
  text8: 'Privacy Policy',
  text4: 'Tennant Resources',
}

Footer.propTypes = {
  rootClassName: PropTypes.string,
  text3: PropTypes.string,
  text2: PropTypes.string,
  text1: PropTypes.string,
  text9: PropTypes.string,
  text5: PropTypes.string,
  button: PropTypes.string,
  text7: PropTypes.string,
  text6: PropTypes.string,
  text10: PropTypes.string,
  textinput_placeholder: PropTypes.string,
  text: PropTypes.string,
  text8: PropTypes.string,
  text4: PropTypes.string,
}

export default Footer
