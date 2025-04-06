"use client";

import React, { useEffect } from "react";
import SimpleMap from "@/app/map/simple-map";
import testRoute from "@/app/map/test-route";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { request } from "http";
import { parseStaticPathsResult } from "next/dist/lib/fallback";

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

function GuavaMaps({ route, color, id, onClick }: {color: string, id: number}) {
  return (
    <div 
      className="w-[400px] h-[300px]"
      onClick={() => onClick(id)}
    >
      <SimpleMap>
        <Polyline
          positions={route}
          color={color}
          weight={5}
          opacity={0.7}
        />
      </SimpleMap>
    </div>
  );
}

export default function MapPage() {
  const searchParams = useSearchParams();
  const [routeParams, setRouteParams] = useState(null);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<number | null>(null);

  const guavaFinder = async (parsedState) => {
    try {
      console.log("Guava finder running...");
      // Now send the parsed object to the backend
      // const res = await fetch('http://localhost:8000/guava', {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(parsedState)  // Send the actual object, not the string
      // });

      // NEW REQUEST TO GOOGLE CLOUD
      // parsedState = {"distance": parsedState.distance, "start_lat": parsedState.start_lat, "start_lon": parsedState.start_lon};

      const input = JSON.stringify(parsedState);
      console.log("the input into the backend python is", input);
      const targetUrl = 'https://python-http-function-93149730763.us-central1.run.app/';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"start_lat": 42.062365, "start_lon": -87.677904, "distance": 5000}'
        // body: input,
      });

      const data = await res.json();
      console.log("the size of the array returned is", data.length);
      console.log("yo guavaFinder has finished", data);
      setResponse(data);
    } catch (error) {
      setResponse('Failed to fetch from backend');
    }
  }

  useEffect(() => {
    const stateParam = searchParams.get('state');
    console.log("searchParams is", stateParam);
    console.log("stateparam is", stateParam);
    if (!stateParam) {
      console.error("No state parameter found");
      return;
    }

    // Parse the JSON string to an object first
    const parsedState = JSON.parse(stateParam);
    setRouteParams(parsedState);
    console.log("parsedState is", parsedState);
    guavaFinder(parsedState);
  }, [searchParams]);

  if (!routeParams || !response) {
    return (
      <div>Loading...</div>
    )
  }

  const handleMapClick = (id: number) => {
    setSelectedMap(id);
  }

  const handleBackToGrid = () => {
    setSelectedMap(null);
  };

  const lineColors = ["red", "blue", "darkslategrey", "darkorange", "deeppink","darkturquoise"]

  const mapData = [
    { id: 1, route: testRoute, color: "red" },
    { id: 2, route: testRoute, color: "blue" },
    { id: 3, route: testRoute, color: "darkslategrey" },
    { id: 4, route: testRoute, color: "darkorange" },
    { id: 5, route: testRoute, color: "deeppink" },
    { id: 6, route: testRoute, color: "darkturquoise" }
  ];

  if(selectedMap !== null) {
    const selectedMapData = mapData.find(map => map.id === selectedMap);

    return (
      // <div className="flex flex-col items-center justify-center h-screen">
      //   <div className="w-[90vw] h-[80vh] mb-4">
      //     <SimpleMap>
      //       <Polyline
      //         positions={selectedMapData.route}
      //         color={selectedMapData.color}
      //         weight={5}
      //         opacity={0.7}
      //       />
      //     </SimpleMap>
      //   </div>
      //   <Button onClick={handleBackToGrid} className="mt-4">
      //     <RotateCcwIcon className="mr-2 h-4 w-4" /> Back to Grid
      //   </Button>
      // </div>
      <div>CLICKED ON MAP!!</div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center w-9/10 h-screen py-15">
        <div className="flex w-full py-10">
          <div className="flex w-1/2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Starting Point</CardTitle>
                <CardDescription>{routeParams.locationName}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Distance</CardTitle>
                <CardDescription>{`${routeParams.distance} ${routeParams.unit}`}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

          <div className="flex flex-row gap-4 mb-8">
            {mapData.slice(0, 3).map((id, route, color) => (
              <GuavaMaps 
                route={route}
                color={color}
                id={id}
                onClick={handleMapClick}
              />
            ))}
            {/* <GuavaMaps route={testRoute} color="red" />
            <GuavaMaps route={testRoute} color="blue" />
            <GuavaMaps route={testRoute} color="darkslategrey" /> */}
          </div>
          <div className="flex flex-row gap-4 mb-8">
            {mapData.slice(3, 6).map((id, route, color) => (
                <GuavaMaps 
                  route={route}
                  color={color}
                  id={id}
                  onClick={handleMapClick}
              />
            ))}
            {/* <GuavaMaps route={testRoute} color="darkorange" />
            <GuavaMaps route={testRoute} color="deeppink" />
            <GuavaMaps route={testRoute} color="darkturquoise" /> */}
          </div>

      </div>
    </div >
  );
}
