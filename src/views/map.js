import React, {useState} from 'react'

import { Helmet } from 'react-helmet'

import Navigation from '../components/navigation'
import Footer from '../components/footer'

import Amplify, { Auth, Signer } from 'aws-amplify'
import ReactMapGL, {
  NavigationControl,
  MapRequest,
  ViewportProps,
} from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Location from "aws-sdk/clients/location"
import awsconfig from "../aws-exports.js"
import { Marker, Popup } from 'react-map-gl';
import pin from '../pin.png'

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

function Map() {
  const [credentials, setCredentials] = useState(null);
  
  const [viewport, setViewport] = useState({
    longitude: -73.984016,
    latitude: 40.754932,
    zoom: 11,
    
  });
  
  const [client, setClient] = useState(null);
  const [showPopup, setShowPopup] = React.useState(true);

  React.useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials(await Auth.currentUserCredentials());
    };
    fetchCredentials();
  }, []);

  return (
      <div>
        <Helmet>
          <title>Search - Creative Agency Page</title>
          <meta property="og:title" content="Search - Creative Agency Page" />
        </Helmet>
        <Navigation rootClassName="navigation-root-class-name"></Navigation>
      <div>
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
  );
}

export default Map
