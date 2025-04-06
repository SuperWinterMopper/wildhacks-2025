"use client";

import React from "react";
import SimpleMap from "@/app/map/simple-map";
import testRoute from "@/app/map/test-route";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

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


          {/* // BUTTON */}
          <div className="w-full flex pr-4 object-left">
            <Button variant="outline" className="cursor-pointer border-2 !border-green-500 h-25 w-50">
              <RotateCcwIcon className="h-25 w-25" />
              Regenerate route
            </Button>
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
    </div >
  );
}
