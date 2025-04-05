"use client";

import React from "react";
import SimpleMap from "./simple-map";
import testRoute from "./test-route";
import dynamic from "next/dynamic";

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div>
      <h1>Mapped Routes</h1>
      <div style={{ height: "600px" }}>
        <SimpleMap>
          <Polyline 
            positions={testRoute}
            color="blue"
            weight={5}
            opacity={0.7}
          />
        </SimpleMap>
      </div>
    </div>
  );
}
