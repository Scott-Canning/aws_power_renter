import React from 'react'

import { Helmet } from 'react-helmet'

import Navigation from '../components/navigation'
import Footer from '../components/footer'
import './search.css'

const Search = (props) => {

  return (
    <div className="search-container">
      <Helmet>
        <title>Search - Creative Agency Page</title>
        <meta property="og:title" content="Search - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name" signedIn={props.signedIn}></Navigation>
      <div className="search-container1">
        <div className="search-container2"></div>
       
        <input
          type="text"
          placeholder="placeholder"
          className="search-textinput input"
        />
        <svg viewBox="0 0 1024 1024" className="search-icon button">
          <path d="M512 682q-18-14-163-127t-221-171l384-298 384 298q-76 58-220 170t-164 128zM512 792l314-246 70 54-384 298-384-298 70-54z"></path>
        </svg>
      </div>
      <Footer rootClassName="footer-root-class-name"></Footer>
    </div>
  )
}

export default Search
