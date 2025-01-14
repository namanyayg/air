import React from 'react';
import DatamapsIndia from 'react-datamaps-india';

interface Props {
  regionData?: Record<string, { 
    value: number;
    name?: string;
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
      <DatamapsIndia
        regionData={regionData}
        mapLayout={mapLayout}
        hoverComponent={hoverComponent}
      />
    </div>
  );
};

export default IndiaMap; 