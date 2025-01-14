'use client';

import React, { useEffect, useState } from 'react';
import IndiaMap from './main';

interface CoalPlant {
  name: string;
  location: string;
  district: string;
  capacity: number;
  operator: string;
  sector: string;
  coordinates: string;
}

interface StateData {
  plants: CoalPlant[];
  totalCapacity: number;
}

interface CoalData {
  [state: string]: StateData;
}

interface RegionData {
  value: number;
  name: string;
  plants?: CoalPlant[];
}

interface RegionDataMap {
  [key: string]: RegionData;
}

export default function CoalMap() {
  const [coalData, setCoalData] = useState<CoalData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/coal-plants.json')
      .then(res => res.json())
      .then((data: CoalData) => {
        setCoalData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading coal plant data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading coal plant data...</div>;
  }

  const regionData = Object.entries(coalData).reduce((acc, [state, data]) => {
    acc[state] = {
      value: data.totalCapacity,
      name: state,
      plants: data.plants,
    };
    return acc;
  }, {} as RegionDataMap);

  return (
    <IndiaMap
      regionData={regionData}
      hoverComponent={({ value }) => (
        <div className="bg-white shadow-lg rounded p-2">
          <p className="font-semibold">{value.name}</p>
          <p>Total Capacity: {value.value} MW</p>
          <p>Number of Plants: {coalData[value.name]?.plants.length || 0}</p>
        </div>
      )}
      mapLayout={{
        title: '',
        legendTitle: 'Total Capacity (MW)',
        startColor: '#FFDAB9',
        endColor: '#FF6347',
        hoverTitle: 'Capacity',
        noDataColor: '#f5f5f5',
        borderColor: '#8D8D8D',
        hoverBorderColor: '#8D8D8D',
        hoverColor: '#e5e5e5',
      }}
    />
  );
} 