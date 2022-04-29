import React from 'react'

import { Helmet } from 'react-helmet'

import Navigation from '../components/navigation'
import About from '../components/about'
import Footer from '../components/footer'
import './about-page.css'

const AboutPage = (props) => {
  return (
    <div className="about-page-container">
      <Helmet>
        <title>About-Page - Creative Agency Page</title>
        <meta property="og:title" content="About-Page - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name1"></Navigation>
      <div className="about-page-container1">
        <About
          text2="Apartment search functionality "
          text3="Road Work/ Construction history"
          text4="Infestation history"
          text5="User generated reviews of past apartments"
          text6="Maintenance complaint history"
          text7="Noise complaint history"
          rootClassName="about-root-class-name"
        ></About>
      </div>
      <Footer rootClassName="footer-root-class-name1"></Footer>
    </div>
  )
}

export default AboutPage
