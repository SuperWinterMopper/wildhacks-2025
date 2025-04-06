"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import SearchControl from "@/app/geosearch";
import L from "leaflet";
import MapClickHandler from "@/app/location-selection/map-click-handler";

// Dynamically import MapContainer and TileLayer, renaming them to avoid conflicts
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
  
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
// const useMapEvents = dynamic(() => import("react-leaflet").then(m => m.useMapEvents), { ssr: false });

// Optional: fix missing default marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});



// const SimpleMap = ({ children }) => {
//     const mapRef = useRef(null);
//     const latitude = 42.045597;
//     const longitude = -87.688568;
  
//     return ( 
//         <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} className="w-full h-full">
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {/* Additional map layers or components can be added here */}
//           {children}
//           <SearchControl/>
//         </MapContainer>
//     );
//   };
  
//   export default SimpleMap;

const SimpleMap = ({ onMapClick, markerPosition }) => {
  const mapRef = useRef(null);
  const latitude = 42.045597;
  const longitude = -87.688568;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      ref={mapRef}
      className="w-full h-full rounded-xl"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Add click handler if provided */}
      {onMapClick && <MapClickHandler onClick={onMapClick} />}

      {/* Place marker if position is given */}
      {markerPosition && (
        <Marker position={markerPosition} icon={markerIcon} />
      )}

      <SearchControl />
    </MapContainer>
  );
};

// const lat = marker?.lat;
// const lng = marker?.lng;

export default SimpleMap;