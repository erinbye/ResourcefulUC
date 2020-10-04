import Link from "next/link";
import Head from "next/head";
import Layout from "../components/layout";
import React, { useState, useEffect, useRef } from "react";
import data from "../data/data.json";

// how to add google maps with react resource: https://www.codexworld.com/google-maps-with-multiple-markers-using-javascript-api/

const GOOGLE_MAP_API_KEY = "AIzaSyD78WeSwW_vaPexydOldzEwDrAj81r0lvE";

const loadGoogleMapScript = (callback) => {
  if (
    typeof window.google === "object" &&
    typeof window.google.maps === "object"
  ) {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
};

const GMap = () => {
  const googleMapRef = useRef(null);

  useEffect(() => {
    initGoogleMap();
  }, []);

  const initGoogleMap = () => {
    let map = null;
    const bounds = new google.maps.LatLngBounds();
    const mapOptions = {
      mapTypeId: "roadmap",
      center: { lat: 39.132316, lng: -84.515017 },
    };
    const coords = data.resources.gnBathrooms.coordinates;

    // Display a map on the web page
    map = new google.maps.Map(googleMapRef.current, mapOptions);

    let infoWindow = new google.maps.InfoWindow();
    let marker, i;

    for (i = 0; i < coords.length; i++) {
      const position = new google.maps.LatLng(coords[i][1], coords[i][2]);
      bounds.extend(position);
      marker = new google.maps.Marker({
        position: position,
        map: map,
        title: coords[i][0],
      });

      const content = "<h3>" + coords[i][0] + "</h3>";

      google.maps.event.addListener(
        marker,
        "click",
        (function (marker, i) {
          return function () {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          };
        })(marker, i)
      );

      map.fitBounds(bounds);
    }

    const boundsListener = google.maps.event.addListener(
      map,
      "bounds_changed",
      function (event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
      }
    );
  };

  return (
    <>
      <div
        ref={googleMapRef}
        style={{
          width: "100%",
          height: 550,
        }}
      />
      <ul>
        <li style={{ display: "inline", padding: "5px" }}>
          <Link href="/garageMap">
            <a>{data.resources.parkingGarages.name}</a>
          </Link>
        </li>
        <li style={{ display: "inline", padding: "5px" }}>
          <Link href="/bathroomMap">
            <a>{data.resources.gnBathrooms.name}</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

// WIP, getting the user's location
// const GeoMap = () => {
//   const googleMapRef = useRef(null);
//   let map, infoWindow;

//   function initMap() {
//     map = new window.google.maps.Map(googleMapRef.current, {
//       center: { lat: 39.132327, lng: -84.515046 },
//       zoom: 6,
//     });
//     infoWindow = new window.google.maps.InfoWindow();

//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           infoWindow.setPosition(pos);
//           infoWindow.setContent("Location found.");
//           infoWindow.open(map);
//           map.setCenter(pos);
//         },
//         () => {
//           handleLocationError(true, infoWindow, map.getCenter());
//         }
//       );
//     } else {
//       // Browser doesn't support Geolocation
//       handleLocationError(false, infoWindow, map.getCenter());
//     }
//   }
//   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(
//       browserHasGeolocation
//         ? "Error: The Geolocation service failed."
//         : "Error: Your browser doesn't support geolocation."
//     );
//     infoWindow.open(map);
//   }
//   return <div ref={googleMapRef} style={{ width: 600, height: 500 }} />;
// };

export default function Map() {
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    loadGoogleMapScript(() => {
      setLoadMap(true);
    });
  }, []);

  return (
    <Layout>
      <Head>
        <title>Map</title>
      </Head>
      {!loadMap ? <div>Loading...</div> : <GMap />}
    </Layout>
  );
}
