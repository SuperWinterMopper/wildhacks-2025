"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import SimpleMap from './simple-map';

export default function MapPage() {
  return (
    <div>
      <h1>Mapped Routes</h1>
      <SimpleMap/>
    </div>
  );
}
