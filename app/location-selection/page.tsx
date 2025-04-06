"use client";

import React, { useState } from "react";
import SimpleMap from "../map/simple-map";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LocationSelectionPage() {
    const [marker, setMarker] = useState<L.LatLng | null>(null);

    const handleMapClick = (latlng: L.LatLng) => {
        setMarker(latlng);
        console.log("Clicked at:", latlng.lat, latlng.lng);
    };

    const router = useRouter();

    return (
        <div className="flex flex-row w-full h-[700px] gap-4">
            {/* Left: Title + Map */}
            <div className="flex flex-col w-3/4 h-full">
                <div className="text-3xl p-4 px-8">Select start location:</div>
                <div className="flex-grow p-5">
                    <SimpleMap
                        onMapClick={handleMapClick}
                        markerPosition={marker}
                    />
                </div>
            </div>

            {/* Right: Marker Info + Button */}
            <div className="flex flex-col w-1/4 h-full justify-between p-4">
                {/* Reserve fixed space for location info */}
                <div className="h-[80px] flex items-center justify-center text-center text-xl border border-dashed border-gray-300 rounded">
                    {marker ? (
                        <div>
                            📍 <strong>{marker.lat.toFixed(3)}, {marker.lng.toFixed(3)}</strong>
                        </div>
                    ) : (
                        <div className="text-neutral-500">Click on the map</div>
                    )}
                </div>

                {/* Button at bottom */}
                <div className="flex justify-center">
                    <Button
                        onClick={() => {
                            router.push("/map");
                        }}
                        variant="outline"
                        className="!border-2 !border-green-500 font-medium p-4 cursor-pointer w-full max-w-[200px] h-20 text-3xl"
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </div>

    );
}
