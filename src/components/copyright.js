import React from 'react'

import PropTypes from 'prop-types'

import './copyright.css'

const Copyright = (props) => {
  return (
    <div className={`copyright-copyright ${props.rootClassName} `}>
      <div className="copyright-max-width">
        <span className="copyright-text">
          <span className="copyright-text01">
            <span>
              © All rights reserved
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <a
            href="https://www.teleporthq.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="copyright-text04">@TeleportHQ.</span>
          </a>
          <span className="copyright-text05">
            <span>
              {' '}
              Powered by
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <a
            href="https://www.vercel.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="copyright-text08">Vercel</span>
          </a>
          <span className="copyright-text09">
            <span>
              . Image source:
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <span>
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
          </span>
          <a
            href="https://www.unsplash.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="copyright-text12">Unsplash</span>
          </a>
          <span className="copyright-text13">.</span>
        </span>
      </div>
    </div>
  )
}

Copyright.defaultProps = {
  rootClassName: '',
}

Copyright.propTypes = {
  rootClassName: PropTypes.string,
}

export default Copyright
