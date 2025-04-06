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

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

function GuavaMaps({ route, color }) {
  return (
    <div className="w-[400px] h-[300px]">
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

  const guavaFinder = async (parsedState) => {
    try {
      console.log("Guava finder running...");
      // Now send the parsed object to the backend
      const res = await fetch('http://localhost:8000/guava', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedState)  // Send the actual object, not the string
      });

      const data = await res.json();
      setResponse(data.message);
      console.log("yo guavaFinder has finished", data.message);
    } catch (error) {
      setResponse('Failed to fetch from backend');
    }
  }

  useEffect(() => {
    const stateParam = searchParams.get('state');
    console.log("stateparam is", stateParam);
    if (!stateParam) {
      console.error("No state parameter found");
      return;
    }

    // Parse the JSON string to an object first
    const parsedState = JSON.parse(stateParam);
    guavaFinder(parsedState);
  }, [searchParams]);

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

        <div className="flex flex-row gap-4 mb-8">
          <GuavaMaps route={testRoute} color="red" />
          <GuavaMaps route={testRoute} color="blue" />
          <GuavaMaps route={testRoute} color="darkslategrey" />
        </div>
        <div className="flex flex-row gap-4 mb-8">
          <GuavaMaps route={testRoute} color="darkorange" />
          <GuavaMaps route={testRoute} color="deeppink" />
          <GuavaMaps route={testRoute} color="darkturquoise" />
        </div>

      </div>

    </div >

  );
}
