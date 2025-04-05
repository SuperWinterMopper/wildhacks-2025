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
    <div className="flex flex-wrap items-center justify-center gap-2 p-4">
      <div className="text-lg">I want to...</div>
      <div className="flex items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-r-none border-r-0">
                {travelType}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {travelTypes.map((u) => (
                <DropdownMenuItem key={u} onClick={() => setTravelType(u)}>
                  {u}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        <Input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-30 rounded-r-none rounded-l-none"
          min="0"
        />
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-white">±</span>
          </div>
          <Input
            type="number"
            value={distanceRange}
            onChange={(e) => setDistanceRange(e.target.value)}
            className="w-30 rounded-r-none rounded-l-none pl-7" 
            min="0"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-l-none border-l-0">
              {unit}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {units.map((u) => (
              <DropdownMenuItem key={u} onClick={() => setUnit(u)}>
                {u}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Scenery</CardTitle>
          <CardDescription>{scenery}</CardDescription>
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
            className={cn("w-[60%] bg-green-200")}
          />
        </CardContent>
      </Card>
    </div>
  )
}

