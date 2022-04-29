import React from 'react'

import PropTypes from 'prop-types'

import PortofolioCard from './portofolio-card'
import './portofolio.css'

const Portofolio = (props) => {
  return (
    <div className="section-container">
      <div className="portofolio-max-width max-content-container">
        <div className="portofolio-text-container">
          <span className="portofolio-text">{props.text}</span>
          <h2 className="portofolio-text01 heading2">
            <span>Explore our portfolio</span>
          </h2>
          <span className="portofolio-text03">
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </span>
            <br></br>
            <span>
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation.
            </span>
          </span>
          <button className="button-secondary button-lg button">
            {props.primary}
          </button>
        </div>
        <div className="portofolio-tab-selector-header">
          <span className="portofolio-text07 tab-selector-btn">
            {props.text1}
          </span>
          <span className="portofolio-text08 tab-selector-btn">
            {props.text2}
          </span>
          <span className="portofolio-text09 tab-selector-btn">
            {props.text3}
          </span>
          <span className="portofolio-text10 tab-selector-btn">
            {props.text4}
          </span>
          <span className="portofolio-text11 tab-selector-btn">
            {props.text5}
          </span>
          <span className="tab-selector-btn">{props.text6}</span>
        </div>
        <div className="portofolio-tab-selector-cards-container">
          <PortofolioCard
            image_src="/playground_assets/unsplash_qj15unotnh0-400h.png"
            rootClassName="portofolio-card-root-class-name"
          ></PortofolioCard>
          <PortofolioCard
            image_src="/playground_assets/unsplash_wwqrpsnbpq4-400h.png"
            project_title="A brand-new advertising idea"
            rootClassName="portofolio-card-root-class-name5"
          ></PortofolioCard>
          <PortofolioCard
            image_src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDEzfHxjb2NhJTIwY29sYXxlbnwwfHx8fDE2NDY5MjYyNTM&amp;ixlib=rb-1.2.1&amp;h=400"
            project_title="Coca-Cola Summer Concept Campaign - 2021"
            rootClassName="portofolio-card-root-class-name4"
          ></PortofolioCard>
          <PortofolioCard
            image_src="https://images.unsplash.com/photo-1519420573924-65fcd45245f8?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDJ8fG51dGVsbGF8ZW58MHx8fHwxNjQ2OTI2MTky&amp;ixlib=rb-1.2.1&amp;h=400"
            project_title="Ad Campaign - I love you as much as I love Nutella"
            rootClassName="portofolio-card-root-class-name3"
          ></PortofolioCard>
          <PortofolioCard
            image_src="https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDd8fGNvY2ElMjBjb2xhfGVufDB8fHx8MTY0NjkyNjI1Mw&amp;ixlib=rb-1.2.1&amp;h=400"
            project_title="Coca-Colla Next Door Campaign - conceptual"
            rootClassName="portofolio-card-root-class-name2"
          ></PortofolioCard>
          <PortofolioCard
            image_src="https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDF8fHN0YXJidWNrc3xlbnwwfHx8fDE2NDY5MjYyMzc&amp;ixlib=rb-1.2.1&amp;h=400"
            project_title="Starbucks secret is a smile when you get your latte"
            rootClassName="portofolio-card-root-class-name1"
          ></PortofolioCard>
        </div>
      </div>
    </div>
  )
}

Portofolio.defaultProps = {
  text: 'our work',
  primary: 'See all projects',
  text1: 'Advertising',
  text3: 'Branding',
  text2: 'Social Media',
  text5: 'Packaging',
  text6: 'Product Design',
  text4: 'UI / UX',
}

Portofolio.propTypes = {
  text: PropTypes.string,
  primary: PropTypes.string,
  text1: PropTypes.string,
  text3: PropTypes.string,
  text2: PropTypes.string,
  text5: PropTypes.string,
  text6: PropTypes.string,
  text4: PropTypes.string,
}

export default Portofolio
