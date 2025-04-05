"use client";

import React from "react";
import SimpleMap from "@/app/map/simple-map";
import testRoute from "@/app/map/test-route";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center w-9/10 h-screen py-15">
        <div className="flex w-full py-10">
          <div className="flex w-1/2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Starting Point</CardTitle>
                  <CardDescription>Sargent Hall</CardDescription>
                </CardHeader>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Distance</CardTitle>
                  <CardDescription>5mi</CardDescription>
                </CardHeader>
              </Card>
          </div>
          <div className="w-1/2 bg-green">
            <p>button on this side</p>
          </div>
        </div>
        <SimpleMap>
          <Polyline 
            positions={testRoute} 
            color="red"
            weight={5}
            opacity={0.7}
            />
        </SimpleMap>
      </div>
    </div>
  );
}
