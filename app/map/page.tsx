"use client";

import React, { useEffect } from "react";
import SimpleMap from "@/app/map/simple-map";
import testRoute from "@/app/map/test-route";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { request } from "http";
import { parseStaticPathsResult } from "next/dist/lib/fallback";
import { Polyline } from "@/app/map/polyline";
import GuavaMaps from "@/app/map/guava-map";


export default function MapPage() {
  type RouteData = { //return type of backend
    nodes: Array<any>; // or more specifically the type of nodes if known
    distance: number;
    name: string;
  }
  type RoutesCollection = RouteData[];  

  const searchParams = useSearchParams();
  const [routeParams, setRouteParams] = useState(null);
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  const [response, setResponse] = useState<RoutesCollection | null>(null);

  const guavaFinder = async (parsedState: any) => {
    try {
      console.log("Guava finder running...");
      const input = JSON.stringify(parsedState);
      
      const targetUrl = 'https://python-http-function-93149730763.us-central1.run.app/';
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"start_lat": 42.062365, "start_lon": -87.677904, "distance": 5}'
        // body: input,
      });

      const data = await res.json();
      console.log("the size of the array returned is", data.length);
      console.log("yo guavaFinder has finished", data);
      setResponse(data);
    } catch (error) {
      console.log("Failed to fetch from backend, error: ", error);
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
  const mapData = response ? response.map((item, index) => {
    return {
      id: index + 1, // Adding 1 to make IDs start at 1 instead of 0
      nodes: item.nodes, // Assuming each item in response has route data
      distance: item.distance,
      name: item.name,
      color: lineColors[index % lineColors.length] // Cycle through colors if there are more routes than colors
    };
  }) : [];  
  
  if(selectedMap !== null) {
    const selectedMapData = mapData.find(map => map.id === selectedMap);
    console.log("selected map is", selectedMapData);

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-[90vw] h-[80vh] mb-4">
          <SimpleMap>
            <Polyline
              positions={selectedMapData.nodes}
              color={selectedMapData.color}
              weight={5}
              opacity={0.7}
            />
          </SimpleMap>
        </div>
        <Button onClick={handleBackToGrid} className="mt-4">
          <RotateCcwIcon className="mr-2 h-4 w-4" /> Back to Grid
        </Button>
      </div>
      // <div>CLICKED ON MAP!!</div>
    );
  }  
  
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center w-9/10 h-screen py-15">
        <div className="flex w-full py-10">
          <div className="flex w-4/5 space-x-10">
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
            {mapData.slice(0, 3).map((item) => (
              <GuavaMaps 
                key={item.id}
                route={item.nodes} // Use the nodes property from your data
                color={item.color}
                id={item.id}
                onClick={handleMapClick}
              />
            ))}
          </div>
      </div>
    </div >
  );
}
