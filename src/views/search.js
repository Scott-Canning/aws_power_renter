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
  const [showPopup, setShowPopup] = React.useState(true);
  const [buttonClicked, setButtonClick] = React.useState(false);
  const [apartmentDetails, setApartmentDetails] = React.useState({});
  const [viewport, setViewport] = useState({
    longitude: -73.984016,
    latitude: 40.754932,
    zoom: 11,
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
    let zillow_param = "Yes";
    console.log(zillow);
    if (zillow) {
      zillow_param = "";
    }
    const url = base_url + "search?q=" + search_params + "&skipZillow=" + zillow_param;
    console.log("[testing] search terms: ", search);
    try {
      let response = await axios.get(url);
      let parsed = JSON.parse(response.data.body);
      console.log("parsed: ", parsed);
      setSearchResponse(parsed);
      setButtonClick(false);
    } catch(err) {
      alert("No apartments matched your query.");
      console.log("error: ", err);
    }
  };

  const zillowCheckBox = () => {
    setZillow(!zillow);
  }

  const RenderResponse = () => {
    const response = searchResponse;
    if (response === undefined) {
      return (
        <div>
        </div>
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
      <div>
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
    setButtonClick(true);
    setApartmentDetails(apartment);
  }

  const HideDetailsClicked = () => { 
    setButtonClick(false);
    setApartmentDetails({});
  }


  const ApartmentDetails = () => {
    let apartment = apartmentDetails;
    console.log("TEST: ", apartment.complaints[0])
    console.log("TEST: ", apartment.violations[0])
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
                <div className="column">
                  <Card.Text>
                    Price: ${apartment.price}
                  </Card.Text>
                  </div>
                  <div className="column">
                  <Card.Text>
                    Bedrooms: {apartment.bedrooms}
                  </Card.Text>
                  </div>
                  <div className="column">
                  <Card.Text>
                    Bathrooms: {apartment.bathrooms}
                  </Card.Text>
                  </div>
              </div>
              <Card.Text>
                <b>Description:</b> {(apartment.description).substring(0,250)}...
              </Card.Text>
              <div>
                <b>311 Complaints</b>
                { apartment.complaints.length != 0 ? apartment.complaints.map((_, i) => { 
                    return <li key={i}>{apartment.complaints[i].date.substring(0,10)} [ Status: {apartment.complaints[i].status} ] {apartment.complaints[i].desc}  </li>
                  }) : (
                    null
                  )
                }
              </div>
              <div>
                <b>Housing Violations</b>
                { apartment.violations.length != 0 ? apartment.violations.map((_, i) => { 
                    // return <li key={i}>{apartment.violations[i].date.substring(0,10)} [ Status: {apartment.violations[i].status} ] {apartment.violations[i].desc}  </li>
                  }) : (
                    null
                  )
                }
              </div>
            </Card.Body>
            <Button className="button-secondary button button-md" style={{marginTop: '15px'}} onClick={() => HideDetailsClicked()}>Hide Details</Button>
          </Card>
        </div>
      );
    }
    return null
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
                <div className="column" style={{width: '24px'}}>
                  <input type="checkbox" defaultChecked={zillow} onChange={zillowCheckBox}/>
                </div>
                <div className="column" style={{width: '20px'}}>
                  <label>Zillow</label>
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
          <Marker longitude={-73.984016} latitude={40.756932} anchor="bottom" >
            <img src={pin} width="30" height="30"/>
          </Marker>

          {showPopup && (
          <Popup longitude={-73.984016} latitude={40.754932}
            anchor="bottom"
            onClose={() => setShowPopup(false)}>
            You are here
          </Popup>)}

            <div style={{ position: "relative", left: 20, top:120 }}>
              <NavigationControl showCompass={false} />
            </div>
          </ReactMapGL>
        ): (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="row">
          <div className="column">
            <RenderResponse/>
          </div>
          <div className="column">
            <div className="result-cards">
              {buttonClicked ? <ApartmentDetails/> : null }
            </div>
          </div>
      </div>
      <Footer rootClassName="footer-root-class-name"></Footer>
    </div>
  )
}


export default Search
