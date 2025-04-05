"use client";

import React from "react";
import dynamic from "next/dynamic";
import testRoute from "./test-route";

// Import your SimpleMap component
import SimpleMapBase from "./simple-map";

// Dynamically import Polyline to avoid SSR issues
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// Create a map component that includes the route
const MapWithRoute = () => {
  const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
  );
  
  const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
  );
  
  const mapRef = React.useRef(null);
  const latitude = 41.8781;
  const longitude = -87.6298;

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "600px", width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline 
        positions={testRoute}
        color="blue"
        weight={5}
        opacity={0.7}
      />
    </MapContainer>
  );
};

export default function MapPage() {
  return (
    <div>
      <h1>Mapped Routes</h1>
      <MapWithRoute />
    </div>
  );
}
