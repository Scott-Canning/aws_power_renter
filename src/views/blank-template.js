import React from 'react'

import { Helmet } from 'react-helmet'

import Navigation from '../components/navigation'
import Footer from '../components/footer'
import './blank-template.css'

const BlankTemplate = (props) => {
  return (
    <div className="blank-template-container">
      <Helmet>
        <title>Blank Template - Creative Agency Page</title>
        <meta
          property="og:title"
          content="Blank Template - Creative Agency Page"
        />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name4"></Navigation>
      <div className="blank-template-container1"></div>
      <Footer rootClassName="footer-root-class-name4"></Footer>
    </div>
  )
}

export default BlankTemplate
