import React , {useState} from 'react'
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
  //const [searchResponse, setSearchResponse] = React.useState([]);
  const [credentials, setCredentials] = useState(null);
  const [showPopup, setShowPopup] = React.useState(true);
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
    /*
    >>> skeleton function:

    const base_url = '';
    const params = search;
    const url = base_url + params;
    let response;
    try {
      response = await axios.get(url);
      setSearchResponse(response.data);
    } catch(err) {
      alert("No apartments matched your query.")
      setSearchResponse([]);
    }

    setSearchResponse(response.data);
    console.log(response.data);

    >>>
    */
    console.log("temp message: ", search)
  };

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
          <div className="search-button">
            <button  className="button-primary button" style={{margin: 'auto', width: '75%'}} onClick={searchClicked}> Search </button>
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
      <Footer rootClassName="footer-root-class-name"></Footer>
    </div>
  )
}

export default Search
