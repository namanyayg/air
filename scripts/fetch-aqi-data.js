import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

// API token - you should store this securely in environment variables
const API_TOKEN = process.env.WAQI_API_TOKEN;
const API_BASE_URL = 'https://api.waqi.info/feed';

// List of major Indian cities including state capitals and major urban centers
const locations = {
  cities: [
    // Metros
    'delhi',
    'mumbai',
    'bangalore',
    'chennai', 
    'kolkata',
    'hyderabad',
    'pune',
    'ahmedabad',
    
    // State Capitals
    'lucknow',        // Uttar Pradesh
    'jaipur',         // Rajasthan
    'bhopal',         // Madhya Pradesh
    'patna',          // Bihar
    'raipur',         // Chhattisgarh
    'bhubaneswar',    // Odisha
    'gandhinagar',    // Gujarat
    'chandigarh',     // Punjab & Haryana
    'thiruvananthapuram', // Kerala
    'ranchi',         // Jharkhand
    'guwahati',       // Assam
    'itanagar',       // Arunachal Pradesh
    'dispur',         // Assam
    'imphal',         // Manipur
    'shillong',       // Meghalaya
    'aizawl',         // Mizoram
    'kohima',         // Nagaland
    'gangtok',        // Sikkim
    'agartala',       // Tripura
    'dehradun',       // Uttarakhand
    'shimla',         // Himachal Pradesh
    'panaji',         // Goa
    
    // Other Major Cities
    'surat',
    'kanpur',
    'nagpur',
    'indore',
    'thane',
    'visakhapatnam',
    'pimpri-chinchwad',
    'vadodara',
    'ludhiana',
    'agra',
    'nashik',
    'faridabad',
    'meerut',
    'rajkot',
    'kalyan-dombivali',
    'vasai-virar',
    'varanasi',
    'srinagar',
    'aurangabad',
    'dhanbad',
    'amritsar',
    'navi-mumbai',
    'allahabad',
    'ranchi',
    'howrah',
    'coimbatore',
    'jabalpur',
    'gwalior',
    'vijayawada',
    'jodhpur'
  ]
};

async function fetchAQIData(location) {
  try {
    const url = `${API_BASE_URL}/${location}/?token=${API_TOKEN}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching data for ${location}:`, error.message);
    } else {
      console.error(`Error fetching data for ${location}:`, error);
    }
    return null;
  }
}

async function getAllAQIData() {
  const results = {
    cities: {}
  };

  // Fetch data for cities
  for (const city of locations.cities) {
    const data = await fetchAQIData(city);
    if (data && data.status === 'ok') {
      results.cities[city] = {
        aqi: data.data.aqi,
        location: {
          name: data.data.city.name,
          coordinates: data.data.city.geo
        },
        measurements: data.data.iaqi,
        timestamp: data.data.time.iso
      };
    }
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

async function generateTableData(data) {
  const tableData = {};
  
  for (const [city, cityData] of Object.entries(data.cities)) {
    tableData[city] = {
      aqi: cityData.aqi,
      name: cityData.location.name,
      // Extract key measurements if they exist
      pm25: cityData.measurements?.pm25?.v || null,
      pm10: cityData.measurements?.pm10?.v || null,
      co: cityData.measurements?.co?.v || null,
      no2: cityData.measurements?.no2?.v || null,
      so2: cityData.measurements?.so2?.v || null,
      o3: cityData.measurements?.o3?.v || null,
      timestamp: cityData.timestamp
    };
  }
  
  return tableData;
}

async function main() {
  try {
    console.log('Fetching AQI data...');
    const data = await getAllAQIData();
    
    // Generate table data
    const tableData = await generateTableData(data);
    
    // Save complete data
    const completeDataPath = path.join(process.cwd(), 'public', 'air-data.json');
    await fs.writeFile(completeDataPath, JSON.stringify(data, null, 2));
    
    // Save table data
    const tableDataPath = path.join(process.cwd(), 'public', 'air-table.json');
    await fs.writeFile(tableDataPath, JSON.stringify(tableData, null, 2));
    
    console.log('Data saved successfully to public/air-data.json and public/air-table.json');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in main execution:', error.message);
    } else {
      console.error('Error in main execution:', error);
    }
  }
}

main();
