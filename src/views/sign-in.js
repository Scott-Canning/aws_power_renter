import React from 'react'

import { Helmet } from 'react-helmet'

import Navigation from '../components/navigation'
import Footer from '../components/footer'
import './sign-in.css'

const SignIn = (props) => {
  return (
    <div className="sign-in-container">
      <Helmet>
        <title>Sign In - Creative Agency Page</title>
        <meta property="og:title" content="Sign In - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name2"></Navigation>
      <div className="sign-in-container1"></div>
      <Footer rootClassName="footer-root-class-name2"></Footer>
    </div>
  )
}

export default SignIn
