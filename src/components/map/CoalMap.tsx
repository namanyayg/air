'use client';

import React, { useEffect, useState } from 'react';
import IndiaMap from './main';

interface PowerStation {
  name: string;
  location: {
    city: string;
    district: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
  };
  technical: {
    unitCapacities: string;
    capacityMW: number;
    operator: string;
    sector: string;
  };
  emissions: {
    annual: {
      co2: number;
      sox: number;
      nox: number;
      pm: number;
    };
    intensity: {
      co2: number;
      sox: number;
      nox: number;
      pm: number;
    };
  };
}

interface PowerStationsData {
  powerStations: PowerStation[];
}

interface StateData {
  totalCapacity: number;
  powerStations: PowerStation[];
  totalEmissions: {
    co2: number;
    sox: number;
    nox: number;
    pm: number;
  };
}

interface RegionData {
  value: number;
  name: string;
  stateData?: StateData;
}

interface RegionDataMap {
  [key: string]: RegionData;
}

interface HoverProps {
  value: {
    name: string;
    value: number;
    stateData?: StateData;
  };
}

export default function CoalMap() {
  const [regionData, setRegionData] = useState<RegionDataMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/coal-plants.json')
      .then(res => res.json())
      .then((data: PowerStationsData) => {
        // Group power stations by state
        const stateData = data.powerStations.reduce((acc, station) => {
          const state = station.location.state;
          if (!acc[state]) {
            acc[state] = {
              totalCapacity: 0,
              powerStations: [],
              totalEmissions: {
                co2: 0,
                sox: 0,
                nox: 0,
                pm: 0
              }
            };
          }
          
          acc[state].powerStations.push(station);
          acc[state].totalCapacity += station.technical.capacityMW;
          acc[state].totalEmissions.co2 += station.emissions.annual.co2;
          acc[state].totalEmissions.sox += station.emissions.annual.sox;
          acc[state].totalEmissions.nox += station.emissions.annual.nox;
          acc[state].totalEmissions.pm += station.emissions.annual.pm;
          
          return acc;
        }, {} as { [key: string]: StateData });

        // Convert to region data format
        const regions = Object.entries(stateData).reduce((acc, [state, data]) => {
          acc[state] = {
            value: data.totalCapacity,
            name: state,
            stateData: data
          };
          return acc;
        }, {} as RegionDataMap);

        setRegionData(regions);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading power station data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading power station data...</div>;
  }

  return (
    <IndiaMap
      regionData={regionData}
      hoverComponent={({ value }: HoverProps) => {
        const data = value.stateData;
        if (!data) return null;
        
        return (
          <div className="bg-white shadow-lg rounded p-4 max-w-sm">
            <h3 className="font-semibold text-lg mb-2">{value.name}</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Power Plants:</span> {data.powerStations.length}</p>
              <p><span className="font-medium">Total Capacity:</span> {data.totalCapacity.toLocaleString()} MW</p>
              <p><span className="font-medium">Annual Emissions:</span></p>
              <ul className="pl-4 text-sm">
                <li>CO₂: {(data.totalEmissions.co2 / 1000000).toFixed(1)}M tonnes</li>
                <li>SOₓ: {(data.totalEmissions.sox / 1000).toFixed(1)}K tonnes</li>
                <li>NOₓ: {(data.totalEmissions.nox / 1000).toFixed(1)}K tonnes</li>
                <li>Particulate Matter: {(data.totalEmissions.pm / 1000).toFixed(1)}K tonnes</li>
              </ul>
            </div>
          </div>
        );
      }}
      mapLayout={{
        title: '',
        legendTitle: 'Total Capacity (MW)',
        startColor: '#FFDAB9',
        endColor: '#FF6347',
        hoverTitle: 'State Details',
        noDataColor: '#f5f5f5',
        borderColor: '#8D8D8D',
        hoverBorderColor: '#8D8D8D',
        hoverColor: '#e5e5e5',
      }}
    />
  );
} 