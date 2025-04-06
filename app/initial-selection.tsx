"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import LocationSearchBar from "@/app/geosearch"
import { OpenStreetMapProvider } from "leaflet-geosearch";
import convert from "./unit-converter"


export default function DistanceSelector() {
  const router = useRouter();
  const provider = new OpenStreetMapProvider();

  const [distance, setDistance] = useState("5");
  const [unit, setUnit] = useState("km");
  const [travelType, setTravelType] = useState("cycle");
  const [distanceRange, setDistanceRange] = useState("0");
  const [scenery, setScenery] = useState(3);
  const [safety, setSafety] = useState(3);
  const [startingLocation, setStartingLocation] = useState("");

  const [query, setQuery] = useState(""); // user input
  const [results, setResults] = useState<Array<{ label: string; x: number; y: number }>>([]);
  const [selected, setSelected] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);

  const units = ["km", "miles", "meters"];
  const travelTypes = ["cycle", "run"];

  const handleSubmit = () => {
    const converted_distance = convert(unit, Number(distance));
    const stateParam = JSON.stringify({
      distance: converted_distance,
      unit: unit,
      travelType: travelType,
      distanceRange: distanceRange,
      scenery: scenery,
      safety: safety,
      start_lat: selected?.y,
      start_lon: selected?.x,
      locationName: selected?.label
    });

    const encodedState = encodeURIComponent(stateParam);
    console.log(encodedState);
    router.push(`/map?state=${encodedState}`);
  }

  function LocationSearchBar() {
    useEffect(() => {
      const fetchResults = async () => {
        if (query.length < 3) {
          setResults([]);
          return;
        }

        const res = await provider.search({ query });
        setResults(res);
      };

      fetchResults();
    }, [query]);

    return (
      <div className="relative w-full flex flex-col items-center gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // update user input
          placeholder="Enter a location"
          className={cn(
            "h-16 w-2/3 !text-2xl !placeholder:text-3xl px-4 py-2"
          )}
        />

        {results.length > 0 && (
          <ul className="absolute top-full mt-1 w-1/2 bg-neutral-900 border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelected(result);
                  setQuery(result.label); // update input with selected result
                  setResults([]); // hide dropdown
                }}
                className="px-4 py-2 cursor-pointer hover:bg-neutral-800 text-2xl"
              >
                {result.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="w-2/3 h-screen border-gray-500 border-2 rounded-3xl">
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 w-full">
        <div className="w-full">
          <div className="text-5xl py-5 text-center">Today, I will...</div>
          <div className="flex items-center justify-center w-2/3 mx-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-r-none border-r-0 cursor-pointer flex-grow w-1/4 !text-3xl h-15">
                  {travelType}
                  <ChevronDown className="ml-1 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {travelTypes.map((u) => (
                  <DropdownMenuItem className="cursor-pointer !text-3xl" key={u} onClick={() => setTravelType(u)}>
                    {u}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="rounded-r-none rounded-l-none flex-grow w-1/4 !text-3xl h-15"
              min="0"
            />
            {/* <div className="relative flex-grow w-1/4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none !text-3xl h-15">
                <span className="text-white">±</span>
              </div>
              <Input
                type="number"
                value={distanceRange}
                onChange={(e) => setDistanceRange(e.target.value)}
                className="rounded-r-none rounded-l-none pl-7 w-full !text-3xl h-15"
                min="0"
              />
            </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-l-none border-l-0 cursor-pointer flex-grow w-1/4 !text-3xl h-15">
                  {unit}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {units.map((u) => (
                  <DropdownMenuItem className="cursor-pointer !text-3xl" key={u} onClick={() => setUnit(u)}>
                    {u}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* <div className="w-full text-5xl py-5 text-center">starting from...</div>
        <div className="w-full flex gap-4">
          <Input
            type="text"
            value={startingLocation}
            onChange={(e) => { setStartingLocation(e.target.value) }}
            placeholder="Enter a location"
            className="flex justify-start cursor-text h-15 w-1/2 placeholder:text-3xl text-3xl"
          />
        </div> */}
        <div className="w-full flex justify-center">{LocationSearchBar()}</div>


        <div className="w-full text-center text-5xl py-5">Prioritizing...</div>
        <div className="w-2/3 flex flex-col justify-center gap-4">
          <Card className="text-3xl">
            <CardHeader>
              <CardTitle>Scenery</CardTitle>
              <CardDescription className="text-2xl">{scenery}</CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                defaultValue={[scenery]}
                max={5}
                min={1}
                step={1}
                onValueChange={(value) => {
                  setScenery(value[0]);
                  console.log(scenery);
                }}
                className={cn("w-[100%] cursor-pointer")}
              />
            </CardContent>
          </Card>
          <Card className="text-3xl">
            <CardHeader>
              <CardTitle>Safety</CardTitle>
              <CardDescription className="text-2xl">{safety}</CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                defaultValue={[safety]}
                max={5}
                min={1}
                step={1}
                onValueChange={(value) => {
                  setSafety(value[0]);
                  console.log(safety);
                }}
                className={cn("w-[100%] cursor-pointer")}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center items-center w-full py-5">
          <Button
            onClick={handleSubmit}
            variant="outline"
            className="!border-2 !border-green-500 font-medium flex justify-center p-4 cursor-pointer w-50 h-20 text-4xl"
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  )
}