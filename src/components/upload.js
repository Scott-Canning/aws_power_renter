import React from 'react'
import PropTypes from 'prop-types'
import { useState } from "react"
import './upload.css'




const Upload = (props) => {
  const handleFileInput = (e) => {
    props.setVal(e.target.files[0]);
  }

//<button onClick={() => uploadFile(selectedFile)} className="upload-file">{props.button}</button>
//<div>File Upload Progress is {progress}%</div>

  return (
    <div className={`upload-container ${props.rootClassName} `}>
      <span className="upload-text">{props.text1}</span>
      <div className="upload-container1">
        <input type="file" accept="image/*" onChange={handleFileInput} className="choose-file"/>
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
