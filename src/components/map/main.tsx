'use client';

import React from 'react'
import ReactDatamaps from './'
import "./styles.css"

interface StateData {
  totalCapacity: number;
  powerStations: Array<{
    name: string;
    technical: {
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
    };
  }>;
  totalEmissions: {
    co2: number;
    sox: number;
    nox: number;
    pm: number;
  };
}

interface Props {
  regionData?: Record<string, { 
    value: number;
    name?: string;
    stateData?: StateData;
  }>;
  mapLayout?: {
    title: string;
    legendTitle: string;
    startColor: string;
    endColor: string;
    hoverTitle: string;
    noDataColor: string;
    borderColor: string;
    hoverBorderColor?: string;
    hoverColor?: string;
  };
  hoverComponent?: React.ComponentType<{ 
    value: { 
      name: string; 
      value: number;
      stateData?: StateData;
    } 
  }>;
}

const IndiaMap: React.FC<Props> = ({ 
  regionData = {},
  mapLayout = {
    title: 'Title',
    legendTitle: 'Legend',
    startColor: '#FFDAB9',
    endColor: '#FF6347',
    hoverTitle: 'Count',
    noDataColor: '#f5f5f5',
    borderColor: '#8D8D8D',
    hoverBorderColor: 'pink',
    hoverColor: 'green',
  },
  hoverComponent
}) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      verticalAlign: 'top',
      overflow: 'hidden'
    }}>
      <ReactDatamaps
        regionData={regionData}
        mapLayout={mapLayout}
        hoverComponent={hoverComponent}
      />
    </div>
  )
}

export default IndiaMap
