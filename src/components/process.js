import React from 'react'

import PropTypes from 'prop-types'

import './process.css'

const Process = (props) => {
  return (
    <div className="process-process section-container">
      <div className="process-max-width max-content-container">
        <span className="process-text">{props.text}</span>
        <h2 className="process-text01 heading2">
          <span>
            We use a simple three step process.
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <br></br>
          <span>Take a look.</span>
        </h2>
        <div className="process-step">
          <span className="process-text05">{props.text1}</span>
          <div className="process-container">
            <span className="process-text06">{props.text4}</span>
            <span className="process-text07">{props.text5}</span>
          </div>
        </div>
        <div className="process-step1">
          <span className="process-text08">{props.text2}</span>
          <div className="process-container1">
            <span className="process-text09">{props.text6}</span>
            <span className="process-text10">{props.text7}</span>
          </div>
        </div>
        <div className="process-step2">
          <span className="process-text11">{props.text3}</span>
          <div className="process-container2">
            <span className="process-text12">{props.text8}</span>
            <span className="process-text13">{props.text9}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Process.defaultProps = {
  text7:
    'Brainstorming is a process of toiling and generating new ideas alone or by holding intensive group discussions between team members in a team.',
  text5:
    'There are countless businesses already in existence, so it’s very likely that you won’t be the first person to think of an idea or product. There are countless businesses already in existence, so it’s very likely that you won’t be the first person to think of an idea or product. ',
  text9:
    'As a creative, using your professional judgement, you should begin filtering your various ideas and designs, retaining the strongest relevant material.',
  text6: 'Intense Brain storming ',
  text4: 'Finding the best idea',
  text1: '01',
  text8: 'Strong design execution',
  text3: '03',
  text: 'Our process',
  text2: '02',
}

Process.propTypes = {
  text7: PropTypes.string,
  text5: PropTypes.string,
  text9: PropTypes.string,
  text6: PropTypes.string,
  text4: PropTypes.string,
  text1: PropTypes.string,
  text8: PropTypes.string,
  text3: PropTypes.string,
  text: PropTypes.string,
  text2: PropTypes.string,
}

export default Process
