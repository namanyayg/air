declare module 'react-datamaps-india' {
  import { ComponentType } from 'react';

  interface MapLayout {
    title: string;
    legendTitle: string;
    startColor: string;
    endColor: string;
    hoverTitle: string;
    noDataColor: string;
    borderColor: string;
    hoverBorderColor?: string;
    hoverColor?: string;
  }

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

  interface RegionData {
    [key: string]: {
      value: number;
      name?: string;
      stateData?: StateData;
    };
  }

  interface DatamapsIndiaProps {
    regionData?: RegionData;
    mapLayout?: MapLayout;
    hoverComponent?: ComponentType<{
      value: {
        name: string;
        value: number;
        stateData?: StateData;
      };
    }>;
  }

  const DatamapsIndia: ComponentType<DatamapsIndiaProps>;
  export default DatamapsIndia;
} 