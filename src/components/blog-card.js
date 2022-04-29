import React from 'react'

import PropTypes from 'prop-types'

import './blog-card.css'

const BlogCard = (props) => {
  return (
    <div className={`blog-card-blog-card ${props.rootClassName} `}>
      <img
        alt={props.image_alt}
        src={props.image_src}
        className="blog-card-image"
      />
      <div className="blog-card-container">
        <button className="blog-card-button button-secondary button">
          {props.button}
        </button>
        <span className="blog-card-text">{props.text1}</span>
      </div>
      <span className="blog-card-text1">
        <span className="">
          Excepteur sint occaecat cupidatat non proident, sunt
          <span
            dangerouslySetInnerHTML={{
              __html: ' ',
            }}
          />
        </span>
        <span className="">in culpa qui and.</span>
      </span>
      <span className="blog-card-text4">{props.text}</span>
    </div>
  )
}

BlogCard.defaultProps = {
  button: 'Web Design',
  image_alt: 'image',
  text1: 'Dec 8, 2022',
  image_src: '/playground_assets/rectangle%2099-1500w.png',
  rootClassName: '',
  text: 'Learn more',
}

BlogCard.propTypes = {
  button: PropTypes.string,
  image_alt: PropTypes.string,
  text1: PropTypes.string,
  image_src: PropTypes.string,
  rootClassName: PropTypes.string,
  text: PropTypes.string,
}

export default BlogCard
