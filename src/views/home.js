import React from 'react'
import { Helmet } from 'react-helmet'
import Navigation from '../components/navigation'
import ServicesCard from '../components/services-card'
import BlogCard from '../components/blog-card'
import Footer from '../components/footer'
import './home.css'

const Home = (props) => {

  
  return (
    <div className="home-container">
      <Helmet>
        <title>Creative Agency Page</title>
        <meta property="og:title" content="Creative Agency Page" />
      </Helmet>
      <Navigation></Navigation>
      <main className="home-main">
        <div className="home-hero section-container">
          <div className="home-max-width max-content-container">
            <div className="home-heading-container">
              <h1 className="home-text heading1">
                <span>
                  Want to get the inside scoop
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>on the apartment you are looking to rent?</span>
              </h1>
              <span className="home-text03">
                <span>Look no further</span>
                <span>!</span>
                <br></br>
                <span></span>
                <br></br>
                <span>
                  {' '}
                  We provide detailed, historical data on noise complaints,
                  maintenance requests,
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <br></br>
                <span></span>
                <span>
                  and construction work for apartments currently on the market
                  in the NYC Area.
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <br></br>
                <span></span>
                <br></br>
                <span>
                  We allow users to supplement the data, and provide reviews,
                  upload
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <br></br>
                <span>
                  related pictures, and leave comments on past apartment.
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
              </span>
              <button className="home-primary button-primary button-lg button">
                Start your search now!
              </button>
            </div>
            <div className="home-gallery">
              <div className="home-container1">
                <img
                  alt="image"
                  src="https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDE5fHxhcGFydG1lbnR8ZW58MHx8fHwxNjQ4NDAwOTY4&amp;ixlib=rb-1.2.1&amp;q=80&amp;w=300"
                  className="home-image"
                />
              </div>
              <div className="home-container2">
                <img
                  alt="image"
                  src="https://images.unsplash.com/photo-1534237710431-e2fc698436d0?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDF8fGJ1aWxkaW5nfGVufDB8fHx8MTY0ODQwMDg5NA&amp;ixlib=rb-1.2.1&amp;q=80&amp;w=1000"
                  className="home-image1"
                />
              </div>
              <div className="home-container3">
                <img
                  alt="image"
                  src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDExfHxidWlsZGluZ3xlbnwwfHx8fDE2NDg0MDA4OTQ&amp;ixlib=rb-1.2.1&amp;q=80&amp;w=1000"
                  className="home-image2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="home-services section-container">
          <div className="home-max-width1 max-content-container">
            <div className="home-heading-container1">
              <div className="home-text-container">
                <span className="home-text19">our services</span>
                <h2 className="heading2">
                  <span>
                    We provide a wide range of
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <br></br>
                  <span>solutions</span>
                </h2>
              </div>
              <div className="home-controls">
                <button className="control-btn">
                  <svg viewBox="0 0 1024 1024" className="home-icon">
                    <path d="M402.746 877.254l-320-320c-24.994-24.992-24.994-65.516 0-90.51l320-320c24.994-24.992 65.516-24.992 90.51 0 24.994 24.994 24.994 65.516 0 90.51l-210.746 210.746h613.49c35.346 0 64 28.654 64 64s-28.654 64-64 64h-613.49l210.746 210.746c12.496 12.496 18.744 28.876 18.744 45.254s-6.248 32.758-18.744 45.254c-24.994 24.994-65.516 24.994-90.51 0z"></path>
                  </svg>
                </button>
                <button className="control-btn">
                  <svg viewBox="0 0 1024 1024" className="home-icon2">
                    <path d="M621.254 877.254l320-320c24.994-24.992 24.994-65.516 0-90.51l-320-320c-24.994-24.992-65.516-24.992-90.51 0-24.994 24.994-24.994 65.516 0 90.51l210.746 210.746h-613.49c-35.346 0-64 28.654-64 64s28.654 64 64 64h613.49l-210.746 210.746c-12.496 12.496-18.744 28.876-18.744 45.254s6.248 32.758 18.744 45.254c24.994 24.994 65.516 24.994 90.51 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="home-cards-container">
              <ServicesCard></ServicesCard>
              <ServicesCard
                text="Get Neighborhood Suggestions"
                image_src="/playground_assets/file-document-200w.png"
              ></ServicesCard>
              <ServicesCard
                text="Add Feedback to Past Apartments"
                image_src="/playground_assets/dice-5-200h.png"
              ></ServicesCard>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="home-max-width2 max-content-container">
            <span className="home-text24">from blog</span>
            <h2 className="home-text25 heading2">
              <span>Our latest articles and resources</span>
            </h2>
            <button className="home-primary1 button-secondary button-lg button">
              Explore the blog
            </button>
            <div className="home-blog-cards-container">
              <BlogCard
                button="Tennant Rights"
                rootClassName="blog-card-root-class-name"
              ></BlogCard>
              <BlogCard
                text1="Aug 14, 2022"
                button="News"
                image_src="/playground_assets/rectangle%2099%20%5B1%5D-1500w.png"
                rootClassName="blog-card-root-class-name1"
              ></BlogCard>
              <BlogCard
                text1="Jul 12, 2022"
                button="Pests"
                image_src="/playground_assets/unsplash_h7qmwoxf6z8-1500w.png"
              ></BlogCard>
            </div>
          </div>
        </div>
        <div className="home-banner section-container">
          <div className="home-max-width3 max-content-container">
            <h2 className="home-text27 heading2">Have Questions?</h2>
            <span className="home-text28">
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </span>
              <br></br>
              <span>
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation.
              </span>
            </span>
            <button className="home-primary2 button-lg button-secondary-white button">
              Contact us
            </button>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  )
}

export default Home
