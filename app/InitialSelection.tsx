"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function DistanceSelector() {
  const [distance, setDistance] = useState("5")
  const [unit, setUnit] = useState("km")

  const units = ["km", "miles", "meters", "feet"]

  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
      <div className="flex items-center">
        <Input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-16 rounded-r-none"
          min="0"
        />
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

      <div className="text-lg">I want to...</div>
    </div>
  )
}

