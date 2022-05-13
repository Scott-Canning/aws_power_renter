import React , { useState, useRef } from 'react'
import { Helmet } from 'react-helmet'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import Amplify, { Auth, Signer } from 'aws-amplify'
import ReactMapGL, {
  NavigationControl,
  MapRequest,
  ViewportProps,
} from "react-map-gl"
import awsconfig from "../aws-exports.js"
import { Marker, Popup } from 'react-map-gl';
import pin from '../pin.png'
import "mapbox-gl/dist/mapbox-gl.css"
import './search.css'
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'


Amplify.configure(awsconfig);
const mapName = "apartmentmap-testing";

const transformRequest = (credentials) => (
  url,
  resourceType
) => {
  if(resourceType == 'Style' && !url?.includes("://")) {
    url = `https://maps.geo.${awsconfig.aws_project_region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  if (url?.includes("amazonaws.com")){
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }
  return {url: url || ""};
};

const Search = (props) => {
  const [search, setSearch] = React.useState("");
  const [zillow, setZillow] = React.useState(true);
  const [searchResponse, setSearchResponse] = React.useState(undefined);
  const [credentials, setCredentials] = useState(null);
  const [detailsButtonClicked, setDetailsButtonClicked] = React.useState(false);
  const [apartmentDetails, setApartmentDetails] = React.useState({});
  const [viewport, setViewport] = useState({
    longitude: -73.984016,
    latitude: 40.754932,
    zoom: 11,
  });
  const [currentlySelectedPin, setCurrentlySelectedPin] = useState({
    longitude: '',
    latitude: ''
  });

  React.useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };
    fetchCredentials();

  }, []);

  async function searchClicked() {
    const base_url = "https://k8edkfkr04.execute-api.us-east-1.amazonaws.com/Dev/";
    const search_params = search;
    let zillow_param;
    if (zillow) {
      zillow_param = "";
      const url = base_url + "search?q=" + search_params + "&skipZillow=" + zillow_param;
      console.log("[testing] search terms: ", search);
      try {
        let response = await axios.get(url);
        let parsed = JSON.parse(response.data.body);
        console.log("parsed: ", parsed);
        setSearchResponse(parsed);
        setDetailsButtonClicked(false);
      } catch(err) {
        alert("No apartments matched your query.");
        console.log("error: ", err);
      }
    } else {
      zillow_param = "Yes";
      const url = base_url + "search?q=" + search_params + "&skipZillow=" + zillow_param;
      console.log("[testing] search terms: ", search);
      try {
        let response = await axios.get(url);
        let parsed = JSON.parse(response.data.body);
        console.log("parsed: ", parsed[0]);
        setSearchResponse(parsed[0]);
        setDetailsButtonClicked(false);
      } catch(err) {
        alert("No apartments matched your query.");
        console.log("error: ", err);
      }
    }
  };

  const zillowCheckBox = () => {
    setSearchResponse(undefined);
    setDetailsButtonClicked(false);
    setZillow(!zillow);
  }

  const RenderZillowResponse = () => {
    const response = searchResponse;
    if (response === undefined) {
      return (
        <div></div>
      )
    } else if (response.length != 0) {
        return (
          <div className="result-cards">
              {response.map((apartment, i) => (
                <Apartment key={i} apartment={apartment} />
              ))}
          </div>
        )
    }
    return (
      <div style={{width: '250px', margin: 'auto', display: 'flex', textAlign: 'center', justifyContent: 'center'}}>
      No Results Matched Your Query
      </div>
    )
  }

  const Apartment = ({apartment}) => (
    <Card className="card">
      <Card.Img variant="top" src={apartment.imgSrc} />
      <Card.Body>
        <Card.Title>
          <b>{apartment.address.streetAddress} {apartment.address.zipcode} {apartment.address.neighborhood} {apartment.address.city} {apartment.address.state}</b>
        </Card.Title>
        <div className="row">
          <div className="column">
            <Card.Text>
              Price: ${apartment.price}
            </Card.Text>
            <b><i>PowerRenter insights:</i></b>
            <Card.Text>
              311 Complaints: {apartment.complaints.length}
            </Card.Text>
            <Card.Text>
              Violations: {apartment.violations.length}
            </Card.Text>
          </div>
          <div className="column">
            <Card.Text>
              {(apartment.description).substring(0,100)}...
            </Card.Text>
          </div>
        </div>
        <Button className="button-secondary button button-md" style={{marginTop: '15px'}} onClick={() => ExpandDetailsClicked({apartment})}>Expand Details</Button>
      </Card.Body>
    </Card>
  )

  const ExpandDetailsClicked = ({apartment}) => { 
    if (zillow){
      setDetailsButtonClicked(true);
      setApartmentDetails(apartment);
      window.scrollTo({
        top: 700,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 700,
        behavior: 'smooth',
      });
    }

  }

  const HideDetailsClicked = () => { 
    setDetailsButtonClicked(false);
    setApartmentDetails({});
  }


  const ApartmentDetails = () => {
    let apartment = apartmentDetails;
    if (apartment != undefined) {
      return (
        <div>
          <Card className="card-large">
            <Card.Img variant="top-large" src={apartment.imgSrc} />
            <Card.Body>
              <Card.Title>
              <b>{apartment.address.streetAddress} {apartment.address.zipcode} {apartment.address.neighborhood} {apartment.address.city} {apartment.address.state}</b>
              </Card.Title>
              <div className="row">
                <div>
                  <Card.Text>
                    Price: ${apartment.price}
                  </Card.Text>
                  </div>
                  <div>
                  <Card.Text>
                    Bedrooms: {apartment.bedrooms}
                  </Card.Text>
                  </div>
                  <div>
                  <Card.Text>
                    Bathrooms: {apartment.bathrooms}
                  </Card.Text>
                  </div>
              </div>
              <Card.Text>
                <b>Description:</b> {(apartment.description).substring(0,250)}... 
                {apartment.url != "" ? <a href={apartment.url} target="_blank" style={{color: 'blue'}}>Read More</a> : null}
              </Card.Text>
              <div>
                {apartment.complaints.length != 0 ? <b>311 Complaints:</b> : null}
                {apartment.complaints.length != 0 ? apartment.complaints.map((_, i) => { 
                    return <li key={i}>{apartment.complaints[i].date.substring(0,10)} [ Status: {apartment.complaints[i].status} ] {apartment.complaints[i].category}: {apartment.complaints[i].desc}</li>
                  }) : (
                    null
                  )
                }
              </div>
              <div>
                {apartment.violations.length != 0 ? <b>Housing Violations</b> : null}
                {apartment.violations.length != 0 ? apartment.violations.map((_, i) => { 
                    return <li key={i}>{apartment.violations[i].date.substring(0,10)} [ Status: {apartment.violations[i].status} ] {apartment.violations[i].desc}</li>
                  }) : (
                    null
                  )
                }
              </div>
              <div>
                {apartment.reviews.length != 0 ? <b>User Reviews:</b> : null}
                {apartment.reviews != undefined ? 
                  apartment.reviews.map((reviews, i) => (
                  <Reviews key={i} review={reviews}/>
                )) : (
                  null
                )}
              </div>
            </Card.Body>
            <Button className="button-secondary button button-md" style={{marginTop: '15px'}} onClick={() => HideDetailsClicked()}>Hide Details</Button>
          </Card>
        </div>
      );
    }
    return null
  }

  const RenderNonZillowResponse = () => {
    const response = searchResponse;
    if (response === undefined ) {
      return (
        <div></div>
      )
    } else if ((response.complaints.length === 0 && response.violations.length === 0 && response.reviews.length === 0)) {
      return (
        <div style={{width: '250px', margin: 'auto'}}>
        No Results Matched Your Query
      </div>
      )
    } else if (response.complaints != undefined || response.violations != undefined || response.reviews != undefined) {
      return (
        <div className="result-cards">
            {response.reviews.length != 0 ? <b>User Reviews:</b> : null}
            {response.reviews != undefined ? 
              response.reviews.map((reviews, i) => (
              <Reviews key={i} review={reviews} />
            )) : (
              null
            )}
            {response.complaints.length != 0 ? <b>311 Complaints:</b> : null}
            {response.complaints != undefined ? 
              response.complaints.map((complaint, i) => (
              <Complaints key={i} complaint={complaint} />
            )) : (
              null
            )}
            {response.violations.length != 0 ? <b>Housing Violations:</b> : null}
            {response.violations != undefined ? 
              response.violations.map((violation, i) => (
              <Violations key={i} violation={violation} />
            )) : (
              null
            )}
        </div>
      )
    }
  }

  const Reviews = ({review}) => (
    <Card className="card" style={{width: '750px'}}>
      <Card.Img variant="top" src={review.userPhoto.url} style={{height: '20vw'}}/>
      <Card.Body>
        <Card.Title>
        </Card.Title>
          <Card.Text>
            <b>{review.date}</b>
          </Card.Text>
          <Card.Text>
            <b>Rating:</b> {review.rating} / 5
          </Card.Text>
          <Card.Text>
            <b>Review:</b> {review.comment}
          </Card.Text>
          <Card.Text>
            <b>User:</b> {review.user}
          </Card.Text>
      </Card.Body>
    </Card>
  )

  const Complaints = ({complaint}) => (
    <Card className="card" style={{width: '750px'}}>
      <Card.Body>
        <Card.Title>
        </Card.Title>
          <Card.Text>
          {complaint.date.substring(0,10)} [ Status: {complaint.status} ] {complaint.category}: {complaint.desc}
          </Card.Text>
      </Card.Body>
    </Card>
  )

  const Violations = ({violation}) => (
    <Card className="card">
      <Card.Body>
        <Card.Title>
        </Card.Title>
          <div>
            {violation.desc}
          </div>
      </Card.Body>
    </Card>
  )


  const refreshPage = () => {
    window.location.reload();
 }

  const RenderMapPins = () => {
    const response = searchResponse;
    if (response === undefined) {
      return (
        null
      )
    } else if (response.length != 0 && zillow) {
        return (
              response.map((apartment, i) => (
                <Marker key={i} longitude={apartment.longitude} 
                        latitude={apartment.latitude} 
                        anchor="bottom" 
                        onClick={() => setCurrentlySelectedPin({longitude: apartment.longitude,latitude: apartment.latitude})}>
                  <img src={pin} width="30" height="30"/>
                </Marker>
              ))    
        )
    } else if (response.length != 0 && !zillow) {
      return (
        <Marker key={1} longitude={response.longitude} 
          latitude={response.latitude} 
          anchor="bottom" 
          onClick={() => setCurrentlySelectedPin({longitude: response.longitude,latitude: response.latitude})}>
          <img src={pin} width="30" height="30"/>
        </Marker>
      )
    }
    return (
      null
    )
  }

  const RenderMapPinPopUps = () => {
    const response = searchResponse;
    if (response === undefined) {
      return (
        null
      )
    } else if (response.length != 0 && zillow) {
        return (
          response.map((apartment, i) => (popupHider(apartment, i)))   
        )
    } else if (response.length != 0 && !zillow) {
      return(
        popupHider(response, 1)
      )
    }
    return (
      null
    )
  }

  function popupHider(apartment, i) {                
    if (currentlySelectedPin.latitude === apartment.latitude && currentlySelectedPin.longitude === apartment.longitude){
      return (
        <Popup  key={i} longitude={apartment.longitude}  latitude={apartment.latitude} 
        anchor="bottom"
        onClose={() => setCurrentlySelectedPin({longitude: '',latitude: ''})}>
        <div align="center">
          <div align="center">{apartment.search_address}</div>
          <Button className="button-secondary button button-md" style={{marginTop: '15px'}} onClick={() => ExpandDetailsClicked({apartment})}>Expand Details</Button>
          <div align="center">
            <Link to="/add-review" className="button-secondary button button-md" style={{marginTop: '10px'}}> Add Review </Link>
          </div>
        </div>
        </Popup>
      )
    } else {
      return (
        null
      )
    }   
  }

  return (
    <div className="search-container">
      <Helmet>
        <title>Search</title>
        <meta property="og:title" content="Search - Creative Agency Page" />
      </Helmet>
      <Navigation rootClassName="navigation-root-class-name" signedIn={props.signedIn}></Navigation>
      <div style={{height: '20px', padding: '1px'}}/>
      <div className="search-container1">
        <div className="search-container2"></div>
        <div style={{height: '125px', width: '75%', padding: '20px', margin: 'auto'}}>
          <input type="text" 
                placeholder="Find your next apartment" 
                className="search-textinput input" 
                value={search} 
                onInput={e => setSearch(e.target.value)} 
                onKeyDown={e => {if(e.key ==='Enter'){searchClicked()}}}/>
          <div className="search-zillow-container">
            <div className="search-button">
              <button className="button-primary button" style={{margin: 'auto', width: '75%'}} onClick={searchClicked}> Search </button>
            </div>
            <div className="zillow-checkbox">
              <div className="row">
                <div className="column" >
                <label className="container" style={{flex: 1, flexDirection: 'row', width: 160}}>Zillow Results
                  <input type="checkbox" className="checkmark" defaultChecked={zillow} onChange={zillowCheckBox}/>
                  <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{height: '0px'}}/>
        {credentials ? (
          <ReactMapGL 
            {...viewport}
            width="100%"
            height="100vh"
            transformRequest={transformRequest(credentials)}
            mapStyle={mapName}
            onViewStateChange={setViewport}
          >
          <RenderMapPins/>
          <RenderMapPinPopUps/>

            <div style={{ position: "relative", left: 20, top:120 }}>
              <NavigationControl showCompass={false} />
            </div>
          </ReactMapGL>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="row">
          <div className="column">
            {(zillow) ? <RenderZillowResponse/> : <RenderNonZillowResponse/>}
          </div>
          <div className="column">
            <div className="result-cards">
              {detailsButtonClicked ? <ApartmentDetails/> : null}
            </div>
          </div>
      </div>
      <Footer rootClassName="footer-root-class-name"></Footer>
    </div>
  )
}


export default Search