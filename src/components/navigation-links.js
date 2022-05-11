import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './navigation-links.css'
import { Auth } from 'aws-amplify'

const NavigationLinks = (props) => {
  // track logged in state to update link name
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  React.useEffect(() => {
    authenticated();
  });

  async function authenticated() {
    try {
        await Auth.currentAuthenticatedUser();
        setIsLoggedIn(true);
        return true;
    } catch {
        setIsLoggedIn(false);
        return false;
    }
  }

  return (
    <nav className={`navigation-links-nav ${props.rootClassName} `}>
      <Link to="/" className="navigation-links-navlink navigation-Link">
        {props.link1}
      </Link>
      <Link
        to="/about-page"
        className="navigation-links-navlink1 navigation-Link"
      >
        {props.link2}
      </Link>
      <Link to="/search" className="navigation-links-navlink2 navigation-Link">
        {props.link3}
      </Link>
      <Link
        to="/add-review"
        className="navigation-links-navlink3 navigation-Link"
      >
        {props.link31}
      </Link>
      <Link
        to="/login"
        className="navigation-links-navlink3 navigation-Link"
      >
        {isLoggedIn === true ? 'Sign Out' : 'Sign In'}
      </Link>
    </nav>
  )
}

NavigationLinks.defaultProps = {
  link31: 'Add Review',
  link3: 'Search',
  rootClassName: '',
  link2: 'About',
  link1: 'Home',
}

NavigationLinks.propTypes = {
  link5: PropTypes.string,
  link31: PropTypes.string,
  link3: PropTypes.string,
  rootClassName: PropTypes.string,
  link2: PropTypes.string,
  link1: PropTypes.string,
}

export default NavigationLinks
