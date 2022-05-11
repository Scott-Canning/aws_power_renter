import React from 'react'

import PropTypes from 'prop-types'

import './row.css'

const Row = (props) => {
  return (
    <div className={`row-container ${props.rootClassName} `}>
      <span className="row-text">{props.text1}</span>
      <div className="row-container1">
        <input
          type="text"
          placeholder={props.textinput_placeholder}
          className="row-textinput input"
          value={props.userVal}
          onChange={(e) => props.setVal(e.target.value)}
          required
        />
      </div>
    </div>
  )
}

Row.defaultProps = {
  text1: 'Text',
  rootClassName: '',
  textinput_placeholder: 'placeholder',
  text: 'Text',
}

Row.propTypes = {
  text1: PropTypes.string,
  rootClassName: PropTypes.string,
  textinput_placeholder: PropTypes.string,
  text: PropTypes.string,
}

export default Row
