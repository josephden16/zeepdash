import React, { useState, useContext, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { firestore } from '../firebase';
import { useQuery } from '../utils';
import { v4 as uuid4 } from 'uuid';
import { UserContext } from './providers/AuthProvider';
import { useHistory } from "react-router-dom";
import ReactMapGl, { Marker, GeolocateControl, FullscreenControl } from "react-map-gl";
import { Form, Image } from "react-bootstrap";
import Seo from "./Seo";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


export default function AddLocation() {
  const seo = {
    metaTitle: 'Add Your Location | ZeepDash',
    metaDescription: 'Add your delivery location on ZeepDash',
  }


  const [viewport, setViewport] = useState({
    latitude: 7.4477245,
    longitude: 3.8967116,
    width: "100%",
    height: "100vh",
    zoom: 14,
  });
  const [addresses, setAddresses] = useState(null);
  const user = useContext(UserContext);

  const history = useHistory();

  const fetchAddresses = async () => {
    if (!user) return null;

    const userId = user.id;

    const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
    const userRef = doc(firestore, collectionName, userId);

    try {
      const snapshot = await getDoc(userRef);
      if (snapshot.exists) {
        let data = snapshot.data();
        let { locations } = data;
        if (locations.length > 0) {
          setAddresses(locations);
        } else {
          setAddresses([]);
        }
      } else {
        setAddresses([]);
      }

    } catch (error) { }
  }

  useEffect(() => {
    fetchAddresses();
  });

  // mapbox controls styles
  const geolocateControlStyle = {
    right: 10,
    top: 10,
  };

  const fullscreenControlStyle = {
    right: 50,
    top: 10
  };

  return (
    <>
      <Seo seo={seo} />
      <div className="add-location-container">
        <SaveLocation addresses={addresses} viewport={viewport} />
        <ReactMapGl {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/csjoe/ckpl49lev0qyh17mz57yi1zgd"
          attributionControl={false}
          onViewportChange={viewport => {
            setViewport(viewport);
            // const { longitude, latitude } = viewport;
            // console.log("longitude: ", longitude);
            // console.log("latitude: ", latitude);
          }}
        >
          <div>
            <button onClick={history.goBack} className="back-button">
              <img style={{ width: '15px' }} alt="go-back" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ5MiA0OTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTE5OC42MDgsMjQ2LjEwNEwzODIuNjY0LDYyLjA0YzUuMDY4LTUuMDU2LDcuODU2LTExLjgxNiw3Ljg1Ni0xOS4wMjRjMC03LjIxMi0yLjc4OC0xMy45NjgtNy44NTYtMTkuMDMybC0xNi4xMjgtMTYuMTIgICAgQzM2MS40NzYsMi43OTIsMzU0LjcxMiwwLDM0Ny41MDQsMHMtMTMuOTY0LDIuNzkyLTE5LjAyOCw3Ljg2NEwxMDkuMzI4LDIyNy4wMDhjLTUuMDg0LDUuMDgtNy44NjgsMTEuODY4LTcuODQ4LDE5LjA4NCAgICBjLTAuMDIsNy4yNDgsMi43NiwxNC4wMjgsNy44NDgsMTkuMTEybDIxOC45NDQsMjE4LjkzMmM1LjA2NCw1LjA3MiwxMS44Miw3Ljg2NCwxOS4wMzIsNy44NjRjNy4yMDgsMCwxMy45NjQtMi43OTIsMTkuMDMyLTcuODY0ICAgIGwxNi4xMjQtMTYuMTJjMTAuNDkyLTEwLjQ5MiwxMC40OTItMjcuNTcyLDAtMzguMDZMMTk4LjYwOCwyNDYuMTA0eiIgZmlsbD0iI2ZlMDAwMCIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
              {/* <img width="20" alt="home" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTQ5OC4xOTUzMTIgMjIyLjY5NTMxMmMtLjAxMTcxOC0uMDExNzE4LS4wMjM0MzctLjAyMzQzNy0uMDM1MTU2LS4wMzUxNTZsLTIwOC44NTU0NjgtMjA4Ljg0NzY1NmMtOC45MDIzNDQtOC45MDYyNS0yMC43MzgyODItMTMuODEyNS0zMy4zMjgxMjYtMTMuODEyNS0xMi41ODk4NDMgMC0yNC40MjU3ODEgNC45MDIzNDQtMzMuMzMyMDMxIDEzLjgwODU5NGwtMjA4Ljc0NjA5MyAyMDguNzQyMTg3Yy0uMDcwMzEzLjA3MDMxMy0uMTQwNjI2LjE0NDUzMS0uMjEwOTM4LjIxNDg0NC0xOC4yODEyNSAxOC4zODY3MTktMTguMjUgNDguMjE4NzUuMDg5ODQ0IDY2LjU1ODU5NCA4LjM3ODkwNiA4LjM4MjgxMiAxOS40NDUzMTIgMTMuMjM4MjgxIDMxLjI3NzM0NCAxMy43NDYwOTMuNDgwNDY4LjA0Njg3Ni45NjQ4NDMuMDcwMzEzIDEuNDUzMTI0LjA3MDMxM2g4LjMyNDIxOXYxNTMuNjk5MjE5YzAgMzAuNDE0MDYyIDI0Ljc0NjA5NCA1NS4xNjAxNTYgNTUuMTY3OTY5IDU1LjE2MDE1Nmg4MS43MTA5MzhjOC4yODEyNSAwIDE1LTYuNzE0ODQ0IDE1LTE1di0xMjAuNWMwLTEzLjg3ODkwNiAxMS4yODkwNjItMjUuMTY3OTY5IDI1LjE2Nzk2OC0yNS4xNjc5NjloNDguMTk1MzEzYzEzLjg3ODkwNiAwIDI1LjE2Nzk2OSAxMS4yODkwNjMgMjUuMTY3OTY5IDI1LjE2Nzk2OXYxMjAuNWMwIDguMjg1MTU2IDYuNzE0ODQzIDE1IDE1IDE1aDgxLjcxMDkzN2MzMC40MjE4NzUgMCA1NS4xNjc5NjktMjQuNzQ2MDk0IDU1LjE2Nzk2OS01NS4xNjAxNTZ2LTE1My42OTkyMTloNy43MTg3NWMxMi41ODU5MzcgMCAyNC40MjE4NzUtNC45MDIzNDQgMzMuMzMyMDMxLTEzLjgwODU5NCAxOC4zNTkzNzUtMTguMzcxMDkzIDE4LjM2NzE4Ny00OC4yNTM5MDYuMDIzNDM3LTY2LjYzNjcxOXptMCAwIiBmaWxsPSIjZmUwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" /> */}
            </button>
          </div>
          <FullscreenControl style={fullscreenControlStyle} />
          <GeolocateControl
            onGeolocate={result => {
              const coords = result.coords;
              const { latitude, longitude } = coords;
              let currentViewport = viewport;
              currentViewport.latitude = latitude;
              currentViewport.longitude = longitude;
              setViewport(currentViewport);
            }}
            style={geolocateControlStyle}
            positionOptions={{ enableHighAccuracy: true, maxZoom: 17 }}
          />
          <Marker
            onDrag={(evt) => {
              const { lngLat } = evt;
              const longitude = lngLat[0];
              const latitude = lngLat[1];
              let currentViewport = viewport;
              currentViewport.latitude = latitude;
              currentViewport.longitude = longitude;
              setViewport(currentViewport);
            }}
            draggable latitude={viewport.latitude} longitude={viewport.longitude}>
            <img alt="marker" width="40" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzUuMjE5IDM1LjIxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzUuMjE5IDM1LjIxOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE3LjYxMiwwQzExLjAwNSwwLDUuNjQ4LDUuMzIxLDUuNjQ4LDExLjg4NWMwLDMuMzU4LDMuMjk0LDkuMzc0LDMuMjk0LDkuMzc0bDguMjI5LDEzLjk2bDguNTg2LTEzLjc5Nw0KCQljMCwwLDMuODE0LTUuNzQsMy44MTQtOS41MzdDMjkuNTcyLDUuMzIxLDI0LjIxNiwwLDE3LjYxMiwweiBNMTcuNTU2LDE4LjQzMWMtMy43ODQsMC02Ljg0OS0zLjA2NS02Ljg0OS02Ljg1Mw0KCQljMC0zLjc4MywzLjA2NC02Ljg0Niw2Ljg0OS02Ljg0NmMzLjc4MiwwLDYuODUsMy4wNjMsNi44NSw2Ljg0NkMyNC40MDYsMTUuMzY2LDIxLjMzOCwxOC40MzEsMTcuNTU2LDE4LjQzMXoiLz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCgk8Zz4NCgk8L2c+DQoJPGc+DQoJPC9nPg0KCTxnPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K" />
          </Marker>
        </ReactMapGl>
      </div>
    </>
  )
}


const SaveLocation = ({ addresses, viewport }) => {
  const [category, setCategory] = useState("");
  const user = useContext(UserContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  let query = useQuery();

  const addAddress = async () => {
    if (!user) {
      toast.error("You must be signed in to save your location");
      history.push(`/login?next=${window.location.pathname}`);
      return;
    }

    if (addresses && addresses.length === 3) {
      toast.info("You can't add more than 3 addresses");
      return;
    }
    if (address === "" && category === "") {
      toast.error("Please fill all form fields");
      return;
    }
    if (!address || address.length < 10) {
      toast.error("Please enter a valid address");
      return;
    }

    if (category === "") {
      toast.error("Please select a category");
      return;
    }

    let id = uuid4();
    let data = {
      id: id,
      name: address,
      category: category,
      googleMapsURL: `https://maps.google.com/maps?q=loc:${viewport.latitude},${viewport.longitude}`,
      latitude: viewport.latitude,
      longitude: viewport.longitude
    }

    let newLocations = addresses.concat(data);
    setLoading(true);

    try {
      const collectionName = process.env.NODE_ENV === 'production' ? 'Users' : 'Users_dev';
      const userRef = doc(firestore, collectionName, user.id);
      await setDoc(userRef, { locations: newLocations }, { merge: true });
      setLoading(false);
      toast.success("Location saved");
      let next = query.get("next");
      if (next) {
        document.location.href = next.substring(1);
      }
    } catch (error) {
      toast.error("Failed to save location");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white my-3 mx-2 save-location-container">
      {/* <div>
        <input className="save-location-input" disabled />
      </div> */}
      <div>
        <input type="text" onChange={(evt) => setAddress(evt.target.value)} placeholder="Enter Address" className="save-location-input" title="Enter Address" />
      </div>
      <div>
        <Form.Control className="save-location-input-select" onChange={(evt) => setCategory(evt.target.value)} as="select">
          <option value="">Select a category...</option>
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </Form.Control>
      </div>
      <div>
        <button disabled={loading ? true : false} onClick={addAddress} className="btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2">
          {!loading && <span>save location</span>}
          {loading && <Image style={{ width: '30px' }} fluid src="/img/loading-2.svg" alt="loading" />}
        </button>
      </div>
    </div>
  )
}
