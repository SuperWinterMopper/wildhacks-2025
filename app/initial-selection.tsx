"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

export default function DistanceSelector() {
  const [distance, setDistance] = useState("5");
  const [unit, setUnit] = useState("km");
  const [travelType, setTravelType] = useState("cycle");
  const [distanceRange, setDistanceRange] = useState("0");
  const [scenery, setScenery] = useState(3);
  const [safety, setSafety] = useState(3);
  
  const units = ["km", "miles", "meters", "feet"];
  const travelTypes = ["cycle", "run"];

  return (
    <div className="w-5/6 h-screen border-gray-500 border-2">
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 w-full">
        <div className="w-full">
          <div className="text-5xl py-5">I want to...</div>
          <div className="flex items-center w-full">
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
            <div className="relative flex-grow w-1/4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none !text-3xl h-15">
                <span className="text-white">±</span>
              </div>
              <Input
                type="number"
                value={distanceRange}
                onChange={(e) => setDistanceRange(e.target.value)}
                className="rounded-r-none rounded-l-none pl-7 w-full !text-3xl h-15" 
                min="0"
                />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-l-none border-l-0 cursor-pointer flex-grow w-1/4 !text-3xl h-15">
                  {unit}
                  <ChevronDown className="ml-1 h-4 w-4"/>
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
        <div className="w-full text-5xl py-5">Prioritizing...</div>
        <Card className="w-full !text-3xl">
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
        <Card className="w-full !text-3xl">
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
      <div className="w-full text-5xl py-5">Starting from...</div>
      <div className="w-full flex gap-4">
        <Input type="text" placeholder="Enter a location" className="flex justify-start cursor-text h-15 w-1/2 placeholder:text-3xl text-3xl" />
      </div>
      <div className="w-full text-5xl py-5">Prioritizing...</div>
      <div className="w-full flex gap-4">
        <Card className="w-1/2 text-3xl">
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
        <Card className="w-1/2 !text-3xl">
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
        <div className="flex justify-center items-center w-full">
            <Button variant="outline" className="!border-2 !border-green-500 font-medium flex justify-center p-4 cursor-pointer w-70 h-15 text-3xl"> 
            Find me routes 
            </Button>
        </div>
    </div>
  )
}