"use client";

import { useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Input } from "@/components/ui/input"; // or use your own
import { cn } from "@/lib/utils"; // optional, for merging classes

const provider = new OpenStreetMapProvider();

export default function LocationSearchBar() {
    const [query, setQuery] = useState(""); // user input
    const [results, setResults] = useState<Array<{ label: string; x: number; y: number }>>([]);
    const [selected, setSelected] = useState<{
        label: string;
        x: number;
        y: number;
    } | null>(null);

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
        <div className="relative w-full flex flex-col items-start gap-2">
            <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // update user input
                placeholder="Enter a location"
                className={cn(
                    "h-16 w-1/2 !text-2xl !placeholder:text-3xl px-4 py-2"
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
