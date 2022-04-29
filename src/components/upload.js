import React from 'react'

import PropTypes from 'prop-types'

import './upload.css'

const Upload = (props) => {
  return (
    <div className={`upload-container ${props.rootClassName} `}>
      <span className="upload-text">{props.text1}</span>
      <div className="upload-container1">
        <button className="button-primary button">{props.button}</button>
      </div>
    </div>
  )
}

Upload.defaultProps = {
  rootClassName: '',
  button: 'Upload',
  text1: 'Relevant Picture(s)',
}

Upload.propTypes = {
  rootClassName: PropTypes.string,
  button: PropTypes.string,
  text1: PropTypes.string,
}

export default Upload
