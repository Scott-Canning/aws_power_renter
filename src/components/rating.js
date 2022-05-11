import React from 'react'

import PropTypes from 'prop-types'

import './rating.css'

const Rating = (props) => {
  return (
    <div className={`rating-container ${props.rootClassName} `}>
      <div className="rating-container1">
        <div className="rating-container2">
          <span className="rating-text">{props.text1}</span>
          <div className="rating-container3">
            <input type="radio" name="radio" className="rating-radiobutton" value={props.userVal} onChange={(e) => props.setVal(1)}/>
            <input type="radio" name="radio" className="rating-radiobutton1" value={props.userVal} onChange={(e) => props.setVal(2)}/>
            <input type="radio" name="radio" className="rating-radiobutton2" value={props.userVal} onChange={(e) => props.setVal(3)}/>
            <input type="radio" name="radio" className="rating-radiobutton3" value={props.userVal} onChange={(e) => props.setVal(4)}/>
            <input type="radio" name="radio" className="rating-radiobutton4" value={props.userVal} onChange={(e) => props.setVal(5)}/>
          </div>
        </div>
        <div className="rating-container4">
          <span className="rating-text1">{props.text}</span>
          <span className="rating-text2">{props.text2}</span>
          <span className="rating-text3">{props.text21}</span>
          <span className="rating-text4">{props.text211}</span>
          <span className="rating-text5">{props.text2111}</span>
        </div>
      </div>
    </div>
  )
}

Rating.defaultProps = {
  text: '1',
  rootClassName: '',
  text21: '3',
  text2: '2',
  text2111: '5',
  text211: '4',
  text1: 'Rating',
}

Rating.propTypes = {
  text: PropTypes.string,
  rootClassName: PropTypes.string,
  text21: PropTypes.string,
  text2: PropTypes.string,
  text2111: PropTypes.string,
  text211: PropTypes.string,
  text1: PropTypes.string,
}

export default Rating
