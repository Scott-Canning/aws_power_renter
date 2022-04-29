import React from 'react'

import PropTypes from 'prop-types'

import './portofolio-card.css'

const PortofolioCard = (props) => {
  return (
    <div className={`portofolio-card-speaker-card ${props.rootClassName} `}>
      <div className="portofolio-card-image-container">
        <img
          alt={props.image_alt}
          src={props.image_src}
          className="portofolio-card-image"
        />
        <div className="portofolio-card-see-project-container">
          <button className="button-secondary-white button button-md">
            See project
          </button>
        </div>
      </div>
      <span className="portofolio-card-first-name">{props.project_title}</span>
    </div>
  )
}

PortofolioCard.defaultProps = {
  rootClassName: '',
  project_title: 'Office Life Campaign - Boost your creativity',
  image_alt: 'image',
  image_src:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDEwfHxwZW9wbGV8ZW58MHx8fHwxNjQzNzA1NTEx&ixlib=rb-1.2.1&w=300',
}

PortofolioCard.propTypes = {
  rootClassName: PropTypes.string,
  project_title: PropTypes.string,
  image_alt: PropTypes.string,
  image_src: PropTypes.string,
}

export default PortofolioCard
