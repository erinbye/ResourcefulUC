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
    const coords = data.resources.printerStations.coordinates;

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
    <div
      ref={googleMapRef}
      style={{
        width: "100%",
        height: 550,
      }}
    />
  );
};

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
