import React from 'react'

import PropTypes from 'prop-types'

import './comments.css'

const Comments = (props) => {
  return (
    <div className={`comments-container ${props.rootClassName} `}>
      <span className="comments-text">{props.text1}</span>
      <div className="comments-container1">
        <textarea
          placeholder={props.textarea_placeholder}
          className="comments-textarea textarea"
          value={props.userVal}
          onChange={(e) => props.setVal(e.target.value)}
          required
        ></textarea>
      </div>
    </div>
  )
}

Comments.defaultProps = {
  text1: 'Comments/Complaints',
  rootClassName: '',
  textarea_placeholder: 'placeholder',
}

Comments.propTypes = {
  text1: PropTypes.string,
  rootClassName: PropTypes.string,
  textarea_placeholder: PropTypes.string,
}

export default Comments
