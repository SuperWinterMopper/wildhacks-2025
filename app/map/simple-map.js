"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import SearchControl from "@/app/geosearch";

// Dynamically import MapContainer and TileLayer, renaming them to avoid conflicts
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
  );
  
  const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
  );

const SimpleMap = ({ children }) => {
    const mapRef = useRef(null);
    const latitude = 42.05879;
    const longitude = -87.67553;

    return ( 
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Additional map layers or components can be added here */}
          {children}
          <SearchControl/>
        </MapContainer>
    );
  };
  
  export default SimpleMap;