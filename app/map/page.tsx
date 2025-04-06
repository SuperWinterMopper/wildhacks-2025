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
      const proxyUrl = 'http://localhost:8080/';
      const targetUrl = 'https://python-http-function-93149730763.us-central1.run.app/';
      const res = await fetch(proxyUrl + targetUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"start_lat": 42.062365, "start_lon": -87.677904, "distance": 5000}'
      });

      console.log("starting request")
      const data = await res.json();
      console.log(data[0]["nodes"])
      setResponse(data);
      console.log("yo guavaFinder has finished", data.message);
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

          {/* {response == null ? <></> :
           response[0]["nodes"].map((n) => {<p>n</p>})} */}

          <div className="flex flex-row gap-4 mb-8">
            {response == null ? <></> :
            <GuavaMaps route={response[0]["nodes"]} color="red" />}
          </div>
          <div className="flex flex-row gap-4 mb-8">
            {response == null ? <></> :
            <GuavaMaps route={response[1]["nodes"]} color="red" />}
          </div>

        </div>
        {/* {response == null ? <></> : <SimpleMap>
          <Polyline
            positions={response[0]["nodes"]}
            color="red"
            weight={5}
            opacity={0.7}
          />
        </SimpleMap>} */}
      </div>
    </div >
  );
}
