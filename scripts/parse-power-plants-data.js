// @ts-expect-error require is not supported in ts
const fs = require('fs');

// Function to parse coordinates into decimal degrees
function parseCoordinates(coordStr) {
  if (!coordStr || coordStr.trim() === '') return null;
  
  try {
    const parts = coordStr.match(/(\d+)°(\d+)′(\d+)″([NS])\s+(\d+)°(\d+)′(\d+)″([EW])/);
    if (!parts) return null;
    
    const lat = (parseInt(parts[1]) + parseInt(parts[2])/60 + parseInt(parts[3])/3600) * (parts[4] === 'N' ? 1 : -1);
    const lng = (parseInt(parts[5]) + parseInt(parts[6])/60 + parseInt(parts[7])/3600) * (parts[8] === 'E' ? 1 : -1);
    
    return {
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    };
  } catch (e) {
    return null;
  }
}

// Calculate emissions based on capacity
function calculateEmissions(capacityMW) {
  const hoursPerYear = 8760;
  const averagePLF = 0.70;
  const emissionFactor = 0.82; // kg CO2/kWh
  
  const annualCO2 = (capacityMW * 1000 * hoursPerYear * averagePLF * emissionFactor) / 1000;
  const annualSOx = (capacityMW * 1000 * hoursPerYear * averagePLF * 6.5) / 1000000;
  const annualNOx = (capacityMW * 1000 * hoursPerYear * averagePLF * 2.5) / 1000000;
  const annualPM = (capacityMW * 1000 * hoursPerYear * averagePLF * 1.0) / 1000000;
  
  return {
    annual: {
      co2: Math.round(annualCO2),
      sox: Math.round(annualSOx),
      nox: Math.round(annualNOx),
      pm: Math.round(annualPM)
    },
    intensity: {
      co2: 820,
      sox: 6.5,
      nox: 2.5,
      pm: 1.0
    }
  };
}

// Main function to process the raw text
function processPowerStationsData(rawText) {
  // Split into lines and get headers
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line);
  const headers = lines[0].split('\t').map(h => h.trim());
  
  // Initialize data structures
  const powerStations = [];
  const regions = new Set();
  
  // Process each line
  lines.slice(1).forEach(line => {
    const values = line.split('\t').map(v => v.trim());
    if (values.length < headers.length) return;
    
    // Skip if contains $ (retired/scrapped)
    if (values[6] && values[6].includes('$')) return;
    
    // Get capacity as number
    const capacityStr = values[7].replace(/,/g, '');
    const capacityMW = parseFloat(capacityStr) || 0;
    
    // Add to regions set
    if (values[4]) regions.add(values[4]);
    
    // Create station object
    const station = {
      name: values[0].replace(/\[\d+\]/g, '').trim(),
      location: {
        city: values[1],
        district: values[2],
        state: values[3],
        region: values[4],
        coordinates: parseCoordinates(values[5])
      },
      technical: {
        unitCapacities: values[6],
        capacityMW: capacityMW,
        operator: values[8],
        sector: values[9]
      },
      emissions: calculateEmissions(capacityMW)
    };
    
    powerStations.push(station);
  });
  
  // Create final JSON structure
  const finalJson = {
    powerStations: powerStations,
    metadata: {
      totalStations: powerStations.length,
      regions: Array.from(regions),
      emissionsDisclaimer: "Emissions are estimated based on standard factors and may vary from actual emissions",
      emissionsUnits: {
        annual: {
          co2: "metric tons/year",
          sox: "metric tons/year",
          nox: "metric tons/year",
          pm: "metric tons/year"
        },
        intensity: {
          co2: "g/kWh",
          sox: "g/kWh",
          nox: "g/kWh",
          pm: "g/kWh"
        }
      },
      calculationAssumptions: {
        plantLoadFactor: 0.70,
        emissionFactors: {
          co2: "0.82 kg/kWh",
          sox: "6.5 g/kWh",
          nox: "2.5 g/kWh",
          pm: "1.0 g/kWh"
        }
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      excludes: "Retired/scrapped stations (marked with $)"
    }
  };
  
  return finalJson;
}

// Example usage:
const rawText = `Name 	Location 	District 	State 	Region 	Coordinates 	Unit capacities 	Capacity
(MW) 	Operator 	Sector
Vindhyachal Super Thermal Power Station[15] 	Vindhya Nagar 	Singrauli 	Madhya Pradesh 	Western 	24°05′53″N 82°40′18″E 	6 x 210, 7x 500 	4,760 	NTPC 	Central
Mundra Thermal Power Station 	Mundra 	Kutch 	Gujarat 	Western 	22°49′22″N 69°33′10″E 	4 x 330, 5 X 660 	4,620 	Adani Power 	Private
Mundra Ultra Mega Power Project[16] 	Mundra 	Kutch 	Gujarat 	Western 	22°49′22″N 69°33′10″E 	5 X 800 	4,000 	Tata Power 	Private
Sasan Ultra Mega Power Project 	Sasan 	Singrauli 	Madhya Pradesh 	Western 		6 x 660 	3,960 	Reliance Power 	Private
KSK Mahanadi Power Project 	Nariyara 	Janjgir–Champa district 	Chhattisgarh 	Western 	22°49′22″N 69°33′10″E 	6 X 600 	3,600 	KSK Energy Ventures 	Private
Jindal Tamnar Thermal Power Plant 	Tamnar 	Raigarh 	Chhattisgarh 	Western 	22°06′16″N 83°27′04″E 	4 x 250, 4 x 600 	3,400 	JSPL 	Private
Chandrapur Super Thermal Power Station 	Urjanagar 	Chandrapur 	Maharashtra 	Western 	20°00′24″N 79°17′21″E 	2 x 210$, 4 x 210, 5 x 500 	3,340 	MSPGCL (MAHAGENCO) 	State
Tirora Thermal Power Station[17] 	Tirora 	Gondia 	Maharashtra 	Western 	21°24′58″N 79°58′3″E 	5 X 660 	3,300 	Adani Power 	Private
Sipat Thermal Power Plant 	Sipat 	Bilaspur 	Chhattisgarh 	Western 	22°07′57″N 82°17′24″E 	2 x 500,3 x 660 	2,980 	NTPC 	Central
RKM Powergen Thermal Power Plant 	Dhobnipali 	Shakti 	Chhattisgarh 	Western 		4×360 	1440 	R. K. M Powergen Private Limited 	Private
Korba Super Thermal Power Plant 	Jamani Palli 	Korba 	Chhattisgarh 	Western 	22°23′11″N 82°40′58″E 	3 x 200, 4 x 500 	2,600 	NTPC 	Central
Sant Singaji Thermal Power Plant 	Dogaliya, Mundi 	khandwa 	Madhya Pradesh 	Western 		2 X 600, 2 X 660 	2,520 	MPPGC 	State
Wanakbori Thermal Power Station 	Wanakbori 	Kheda 	Gujarat 	Western 	22°52′39″N 73°21′35″E 	7 x 210, 1 × 800 	2,270 	GSECL 	State
Dada Dhuniwale Thermal Power Plant 	Guyda, Mundi 	khandwa 	Madhya Pradesh 	Western 		2 X 800 	1,600 	MPPGC 	State
Bhusawal Thermal Power Station 	Deepnagar 	Jalgaon 	Maharashtra 	Western 	21°02′57″N 75°50′32″E 	2 x 210$, 2 x 500 	1,000 	MSPGCL (MAHAGENCO) 	State
Trombay Thermal Power Station 	Trombay 	Mumbai 	Maharashtra 	Western 	19°00′09″N 72°53′54″E 	1 x 150$, 2 x 500$, 1 x 250 	750 	Tata Power 	Private
Amravati Thermal Power Plant 	Nandgaonpeth 	Amravati 	Maharashtra 	Western 	21°04′49″N 77°54′06″E 	5 X 270, (5 X 270[18]) 	1,350 	Indiabulls 	Private
Khaparkheda Thermal Power Station 	Kaparkheda 	Nagpur 	Maharashtra 	Western 	21°16′55″N 79°06′54″E 	4 x 210, 1 x 500 	1,340 	MSPGCL (MAHAGENCO) 	State
Sanjay Gandhi Thermal Power Station 	Birsinghpur 	Umaria 	Madhya Pradesh 	Western 	23°18′18″N 81°03′51″E 	4 x 210, 1 x 500 	1,340 	MPPGCL 	State
Satpura Thermal Power Station 	Sarni 	Betul 	Madhya Pradesh 	Western 	22°06′33″N 78°10′24″E 	5 x 62.5$, 1 x 200, 3 x 210, 2 x 250 	1,330 	MPPGCL 	State
Essar Salaya Power Plant 	Salaya 	Jamnagar district 	Gujarat 	Western 	22°17′54.71″N 69°43′10.17″E 	2X600 	1,200 	Essar Energy 	Private IPP
DB Thermal Project Ltd. 	Tundri 	Janjgir-Champa 	Chhattisgarh 	Eastern 	22°26′00″N 83°10′47″E 	2X600 	1,200 	DB POWER 	Private IPP
Parli Thermal Power Station 	Parli-Vaijnath 	Beed 	Maharashtra 	Western 	18°54′21″N 76°32′36″E 	3 x 210$, 2 x 210$, 2 x 250 	500 	MSPGCL (MAHAGENCO) 	State
Gandhinagar Thermal Power Station 	Gandhinagar 	Gandhinagar 	Gujarat 	Western 	23°14′59″N 72°40′26″E 	2 x 120$, 3 x 210 	630 	GSECL 	State
Ukai Thermal Power Station 	Ukai dam 	Tapi 	Gujarat 	Western 	21°12′39″N 73°33′26″E 	2 x 120$, 2 x 200, 1 x 210, 1 x 500 	1110 	GSECL 	State
Hasdeo Thermal Power Station 		Korba 	Chhattisgarh 	Western 	22°24′45″N 82°41′19″E 	4 x 210 	840 	CSPGCL 	State
Nashik Thermal Power Station 	Nashik 	Nashik 	Maharashtra 	Western 	19°58′50″N 73°53′29″E 	3 x 210 	630 	MSPGCL (MAHAGENCO) 	State
Koradi Thermal Power Station 	Koradi 	Nagpur 	Maharashtra 	Western 	21°14′52″N 79°05′53″E 	2 x 210$, 3 x 660 	2400 	MSPGCL (MAHAGENCO) 	State
Lanco Amarkantak Power Plant 	Pathadi 	Korba 	Chhattisgarh 	Western 	22°14′44″N 82°43′24″E 	2 x 300 	600 	Lanco Infratech 	Private
Wardha Warora Power Plant 	Warora 	Chandrapur 	Maharashtra 	Western 	20.272483108514376, 78.98085239550917 	4 x 135 	540 	KSK Energy Ventures 	Private
Dr Shyama Prasad Mukharjee Thermal Power Station 		Korba 	Chhattisgarh 	Western 	22°22′12″N 82°43′16″E 	2 x 250 	500 	CSPGCL 	State
Dahanu Thermal Power Station 	Dahanu 	Thane 	Maharashtra 	Western 	19°57′12″N 72°44′54″E 	2 x 250 	500 	Adani Power 	Private
Paras Thermal Power Station 	Vidyutnagar 	Akola 	Maharashtra 	Western 	20°42′55″N 76°47′37″E 	2 x 250 	500 	MSPGCL (MAHAGENCO) 	State
KSK Mahanadi Power Project 	Nariyara 	Bilaspur 	Chhattisgarh 	Western 		1 x 135 	135 	KSK Energy Ventures 	Private
NSPCL Bhilai Power Plant 	Bhilai 	Durg 	Chhattisgarh 	Western 	21°10′58″N 81°25′28″E 	2 x 250 	500 	NSPCL 	Central
Surat Thermal Power Station 	Nani Naroli 	Surat 	Gujarat 	Western 	21°23′46″N 73°06′22″E 	4 x 125 	500 	Gujarat Industries Power Company Ltd. 	State
Amarkantak Thermal Power Station 	Chachai 	Anuppur 	Madhya Pradesh 	Western 	23°09′52″N 81°38′17″E 	2 x 120$, 1 x 210 	210 	MPPGCL 	State
Bhawnendra Singh Deo Power Plant 		Korba 	Chhattisgarh 	Western 	22°23′01″N 82°43′08″E 	4 x 50$, 2 x 120$ 	0 	CSPGCL 	State
Sabarmati Thermal Power Station 	Ahmedabad 	Ahmedabad 	Gujarat 	Western 	23°04′14″N 72°35′38″E 	1 x 60$, 1 x 120, 2 x 121 	362 	Torrent Power 	Private
CESC Chandrapur Thermal Power Station[19][20][21] 	Chandrapur 	Chandrapur 	Maharashtra 	Western 		2 x 300 	600 	CESC 	Private
Kutch Thermal Power Station 	Panandhro 	Kutch 	Gujarat 	Western 	23°39′50″N 68°47′01″E 	2 x 70$, 2 x 75 	150 	GSECL 	State
Akrimota Thermal Power Station 	Chher Nani 	Kutch 	Gujarat 	Western 	23°46′21″N 68°38′44″E 	2 x 125 	250 	GMDC 	State
Sikka Thermal Power Station 	Jamnagar 	Jamnagar 	Gujarat 	Western 	22°25′20″N 69°49′37″E 	2 x 120$, 2 x 250 	500 	GSECL 	State
Dhuvaran Thermal Power Station 	Khambhat 	Anand 	Gujarat 	Western 	22°13′59″N 72°45′25″E 	2 x 110$ 	- 	GSECL 	State
Rihand Thermal Power Station 	Rihand Nagar 	Sonbhadra 	Uttar Pradesh 	Northern 	24°01′39″N 82°47′28″E 	6 x 500 	3,000 	NTPC 	Central
Singrauli Super Thermal Power Station 	Shaktinagar 	Sonbhadra 	Uttar Pradesh 	Northern 	24°06′16″N 82°42′27″E 	5 x 200, 2 x 500 	2,000 	NTPC 	Central
NTPC Dadri 	Vidyutnagar 	Gautam Budh Nagar 	Uttar Pradesh 	Northern 	28°36′04″N 77°36′25″E 	4 x 210, 2 x 490 	1,820 	NTPC 	Central
Anpara Thermal Power Station 	Anpara 	Sonbhadra 	Uttar Pradesh 	Northern 	24°12′11″N 82°47′18″E 	3 x 210, 2 x 500, 2X500 	2,630 	UPRVUNL 	State
Suratgarh Super Thermal Power Plant 	Suratgarh 	Sri Ganganagar 	Rajasthan 	Northern 	29°10′56″N 74°01′09″E 	6 x 250 	1,500 	RVUNL 	State
Panipat Thermal Power Station 	Assan 	Panipat 	Haryana 	Northern 		2 x 250, 2 x 210$, 4 x 110$ 	710 	HPGCL 	State
Obra Thermal Power Station 	Obra 	Sonbhadra 	Uttar Pradesh 	Northern 	24°26′41″N 82°58′41″E 	2 x 50$, 1 x 40, 1 x 94$, 2 x 94, 5 x 200 	1,188 	UPRVUNL 	State
Guru Gobind Singh Super Thermal Power Plant 	Ghanauli 	Rupnagar 	Punjab 	Northern 	31°02′32″N 76°35′02″E 	4 x 210,$ 4 x 210 	840 	PSPCL 	State
Talwandi Sabo Power Project 	Banawala 	Mansa 	Punjab 	Northern 	29°53′31″N 75°12′53″E 	3 × 660 	1980 	Vedanta Limited 	Private
Kota Super Thermal Power Plant 	Kota 	Kota 	Rajasthan 	Northern 	25°10′17″N 75°48′54″E 	2 x 110, 3 x 210, 2 x 195 	1,240 	RVUNL 	State
Rosa Thermal Power Plant 	Rosa 	Shahjahanpur 	Uttar Pradesh 	Northern 	27°49′07″N 79°56′10″E 	4 x 300 	1,200[22] 	Reliance Power Limited 	Private
Rajiv Gandhi Thermal Power Station 	Khedar 	Hisar 	Haryana 	Northern 	29°21′25″N 75°52′02″E 	2 x 600 	1,200 	HPGCL 	State
Indira Gandhi Super Thermal Power Project 	Jharli 	Jhajjar 	Haryana 	Northern 	29°21′25″N 75°52′02″E 	3 x 500 	1,500 	Aravali Power Company India Limited 	Central
Raj West Lignite Power Plant 	Barmer 	Barmer 	Rajasthan 	Northern 	25°53′20″N 71°19′25″E 	8 x 135 	1,080 	JSW Energy 	Private
Feroj Gandhi Unchahar Thermal Power Plant 	Unchahar 	Raebareli 	Uttar Pradesh 	Northern 	25°54′52″N 81°19′33″E 	5 x 210 	1,050 	NTPC 	Central
Guru Hargobind TP 	Lehra Mohabbat 	Bathinda 	Punjab 	Northern 	30°16′04″N 75°09′53″E 	2 x 210$, 2 x 250 	500 	PSPCL 	State
Badarpur Thermal Power Station 	Badarpur 	New Delhi 	Delhi 	Northern 	28°30′22″N 77°18′26″E 	3 x 95$, 2 x 210$ 	- 	NTPC 	Central
Parichha Thermal Power Station 	Parichha 	Jhansi 	Uttar Pradesh 	Northern 	25°30′51″N 78°45′36″E 	2 x 110, 2 x 210, 2 x 250 	1140 	UPRVUNL 	State
Lalitpur Thermal Power Station 	Mehroni 	Lalitpur 	Uttar Pradesh 	Northern 	25°30′53″N 78°45′34″E 	3 x 660 	1980 	Bajaj Hindustan Ltd. 	Joint
Deenbandhu Chhotu Ram Thermal Power Station 	Yamuna Nagar 	Yamuna Nagar 	Haryana 	Northern 		2 x 300 	600 	HPGCL 	State
Chhabra Thermal Power Plant 	Mothipura 	Baran 	Rajasthan 	Northern 	24°37′14″N 77°02′10″E 	2 x 250 	500 	RVUNL 	State
Guru Nanak Dev Thermal Plant 	Bathinda 	Bathinda 	Punjab 	Northern 	30°14′02″N 74°55′26″E 	4 x 110$ 	00 	PSPCL 	State
Tanda Thermal Power Plant 	Vidyutnagar 	Ambedkar Nagar 	Uttar Pradesh 	Northern 	26°35′22″N 82°36′04″E 	4 x 110 	440 	NTPC 	Central
Barsingsar Thermal Power Station 	Barsingsar 	Bikaner 	Rajasthan 	Northern 	27°49′09″N 73°12′28″E 	2 x 125 	250 	NLC 	Central
Giral Lignite Power Plant 	Thumbli 	Barmer 	Rajasthan 	Northern 	26°02′44″N 71°15′13″E 	2 x 125 	250 	RVUNL 	State
Harduaganj Thermal Power Station 	Harduaganj 	Aligarh 	Uttar Pradesh 	Northern 	28°01′00″N 78°07′50″E 	1 x 55, 1 x 60$, 1 x 105 	160 	UPRVUNL 	State
Panki Thermal Power Station 	Panki 	Kanpur 	Uttar Pradesh 	Northern 	26°28′35″N 80°14′31″E 	2 x 105$ 		UPRVUNL 	State
Rajghat Power Station 	Rajghat 	New Delhi 	Delhi 	Northern 		2 X 67.5$ 	- 	IPGCL 	State
VS Lignite Power Plant 	Gurha 	Bikaner 	Rajasthan 	Northern 	27°51′18″N 72°51′22″E 	1 x 135 	135 	KSK Energy Ventures 	Private
Faridabad Thermal Power Station 	Faridabad 	Faridabad 	Haryana 	Northern 	28°22′28″N 77°18′21″E 	1 x 55 	55 	HPGCL 	State
Barh Super Thermal Power Station 	Barh 	Patna 	Bihar 	Eastern 	25°14′34″N 87°15′48″E 	3 x 660, 2 x 660 	3,300 	NTPC 	Central
Talcher Super Thermal Power Station[23] 	Kaniha 	Angul 	Odisha 	Eastern, Southern 	21°05′49″N 85°04′30″E 	2 x 500, 4 X 500 	3,000 	NTPC 	Central
Sterlite Jharsuguda Power Station 	Jharsuguda 	Jharsuguda 	Odisha 	Eastern 	21°48′49″N 84°02′23″E 	4x600 	2,400 	Vedanta 	Private
Mejia Thermal Power Station 	Durlavpur 	Bankura 	West Bengal 	Eastern 	23°27′47″N 87°07′51″E 	4 x 210, 2 x 250, 2 x 500 	2,340 	DVC 	Central
Kahalgaon Super Thermal Power Station 	Kahalgaon 	Bhagalpur 	Bihar 	Eastern 	25°14′34″N 87°15′48″E 	4 x 210, 3 x 500 	2,340 	NTPC 	Central
Farakka Super Thermal Power Station 	Farakka 	Murshidabad 	West Bengal 	Eastern 	24°46′23″N 87°53′43″E 	3 x 200, 2 x 500, 1 x 500 	2,100 	NTPC 	Central
Nabinagar Super Thermal Power Project 	Nabinagar 	Aurangabad 	Bihar 	Eastern 	25°14′34″N 87°15′48″E 	3 x 660 	1,980 	NTPC 	Central
Vedanta Jharsuguda Captive Power Plant 	Jharsuguda 	Jharsuguda 	Odisha 	Eastern 	21°47′08″N 84°03′18″E 	9x135 	1,215 	Vedanta 	Private
Kolaghat Thermal Power Station 	Mecheda 	East Midnapore 	West Bengal 	Eastern 	22°25′00″N 87°52′15″E 	6 x 210 	1,260 	WBPDCL 	State
Chandrapura Thermal Power Station 	Chandrapura 	Bokaro 	Jharkhand 	Eastern 		3 x 130$, 3 x 120, 2 x 250 	860 	DVC 	Central
Angul Thermal Power Station 	Angul 	Angul 	Odisha 	Eastern 	21°07′29″N 84°58′51″E 	2x600 	1,200 	Jindal India Thermal Power 	Private
National Aluminium Company Captive Power Plant 	Angul 	Angul 	Odisha 	Eastern 	20°51′11″N 85°11′26″E 	10 x 120 	1,200 	NALCO 	State
Kamalanga Thermal Power Plant 	Dhenkanal 	Dhenkanal 	Odisha 	Eastern 	20°52′24″N 85°16′28″E 	3x350 	1,050 	GMR Group 	State
Bakreshwar Thermal Power Station 	Suri 	Birbhum 	West Bengal 	Eastern 	23°49′43″N 87°27′06″E 	5 x 210 	1,050 	WBPDCL 	State
Maithon Power Plant[24] 	Maithon 	Dhanbad 	Jharkhand 	Eastern 		2 X 525 	1,050 	DVC, Tata Power 	Central
Durgapur Steel Thermal Power Station 	Durgapur 	Bardhaman 	West Bengal 	Eastern 	23°27′47″N 87°07′51″E 	2 x 500 	1,000 	DVC 	Central
Koderma Thermal Power Station 	Kodarma 	Koderma 	Jharkhand 	Eastern 	23°27′47″N 87°07′51″E 	2 x 500 	1,000 	DVC 	Central
Bhartiya Rail Bijlee Company Limited (BRBCL) 	Nabinagar 	Aurangabad 	Bihar 	Eastern 	25°14′34″N 87°15′48″E 	4x 250 	1,000 	NTPC 	Central
Ib Thermal Power Station 	Banharpali 	Jharsuguda 	Odisha 	Eastern 	21°41′23″N 83°51′36″E 	8 x 120 	960 	OPGCL 	State
Barauni Thermal Power Station 	Barauni 	Begusarai 	Bihar 	Eastern 	25°23′59″N 86°01′20″E 	2 x 50, 2 x 105, 2 x 250 	810 	NTPC 	State
Patratu Thermal Power Station 	Patratu 	Ramgarh Cantonment 	Jharkhand 	Eastern 	23°38′27″N 85°17′36″E 	4 x 40$, 2 x 90$, 2 x 105$, 2 x 110$ 	840 	JSEB 	State
Budge Budge Thermal Power Plant 	Budge Budge 	South 24 Paraganas 	West Bengal 	Eastern 	22°28′09″N 88°08′23″E 	3 x 250 	750 	CESCL 	Private
Santaldih Thermal Power Station 	Santaldih 	Purulia 	West Bengal 	Eastern 	23°36′08″N 86°28′06″E 	4 x 120$, 2 x 250 	500 	WBPDCL 	State
Durgapur Thermal Power Station 	Durgapur 	Bardhaman 	West Bengal 	Eastern 	23°31′09″N 87°18′05″E 	2 x 30$, 1 x 70$, 2 x 75$, 1 x 110, 1 x 300 	410 	DVC 	State
Bokaro Thermal Power Station 	Bokaro 	Bokaro 	Jharkhand 	Eastern 	23°47′04″N 85°52′50″E 	2 x 210$, 1 x 210, 1 x 500 	710 	DVC 	Central
Kanti Thermal Power Station 	Kanti 	Muzaffarpur 	Bihar 	Eastern 	26°11′41″N 85°18′06″E 	2 x 110, 2 x 195 	610 	NTPC 	State
Sagardighi Thermal Power Station 	Monigram 	Murshidabad 	West Bengal 	Eastern 	24°22′44″N 88°05′44″E 	2 x 300 2X 500 	1600 	WBPDCL 	State
Talcher Thermal Power Station 	Talcher 	Angul 	Odisha 	Eastern 	20°54′41″N 85°12′27″E 	4 x 60, 2 x 110 	460 	NTPC 	Central
Bandel Thermal Power Station 	Bandel 	Hooghly 	West Bengal 	Eastern 	22°59′44″N 88°24′13″E 	4 x 60, 1 x 210 	450 	WBPDCL 	State
Jojobera Thermal Power Plant 	Jojobera 	East Singhbhum 	Jharkhand 	Eastern 	22°45′21″N 86°14′57″E 	3 x 120, 1x67.5 	427.5 	Tata Power 	Private
Tenughat Thermal Power Station 	Lalpania 	Bokaro 	Jharkhand 	Eastern 	23°43′38″N 85°45′53″E 	2 x 210 	420 	TVNL 	State
Hirakud Captive Power Plant 	Hirakud 	Sambalpur 	Odisha 	Eastern 	21°47′08″N 84°03′18″E 	1 x 67.5, 3 x 100 	367.5 	Hindalco Industries 	Private CPP
Durgapur Thermal Power Station 	Durgapur 	Bardhaman 	West Bengal 	Eastern 	23°31′59″N 87°15′00″E 	1 x 140$, 1 x 210 	210 	DVC 	Central
Titagarh Thermal Power Station 	Titagarh 	North 24 Paraganas 	West Bengal 	Eastern 	22°43′56″N 88°22′11″E 	4 x 60 	240 	CESCL 	Private
CESC Southern Generating Station 	Kolkata 	Kolkata 	West Bengal 	Eastern 	22°32′58″N 88°17′29″E 	3 x 67.5 	135 	CESCL 	Private
New Cossipore Generating Station 	Cossipore 	Kolkata 	West Bengal 	Eastern 		2 x 30$, 2 x 50$, 1 x 100 	100 	CESCL 	Private
NTPC Ramagundam 	Ramagundam 	Peddapalli 	Telangana 	Southern 	18°45′31″N 79°27′17″E 	3 x 200, 4 x 500 	2,600 	NTPC 	Central
Simhadri Super Thermal Power Plant 	Visakhapatnam 	Visakhapatnam 	Andhra Pradesh 	Southern 	17°35′38″N 83°5′23″E 	4 x 500 	2,000 	NTPC 	Central
Neyveli Thermal Power Station II 	Neyveli 	Cuddalore 	Tamil Nadu 	Southern 	11°33′28″N 79°26′31″E 	7 x 210, 2 x 250 	1,970 	NLC 	Central
Dr Narla Tatarao TPS 	Ibrahimpatnam 	Krishna 	Andhra Pradesh 	Southern 	16°35′58″N 80°32′12″E 	6 x 210, 1 x 500 1 x 800 	2,560 	APGENCO 	State
Raichur Thermal Power Station 	Shaktinagar 	Raichur 	Karnataka 	Southern 	16°21′20″N 77°20′36″E 	7 x 210, 1 x 250 	1,720 	KPCL 	State
Kothagudem Thermal Power Station 	Paloncha 	Khammam 	Telangana 	Southern 	17°37′18″N 80°41′15″E 	4 x 60$, 4 x 120$, 2 x 250, 1 x 500, 1 x 800 	1,800 	TSGENCO 	State
Sri Damodaram Sanjeevaiah Thermal Power Station 	Krishnapatnam 	Nellore 	Andhra Pradesh 	Southern 	14°19′39″N 80°07′15″E 	2 x 800 	1,600 	APPDCL 	State
Vallur Thermal Power Station 	Vallur 	Chennai 	Tamil Nadu 	Southern 		3 x 500 	1,500 	NTPC & TNEB 	State & central
Sembcorp Gayatri Power Complex[25] 	Krishnapatnam 	Nellore 	Andhra Pradesh 	Southern 	14°19′45″N 80°08′27″E 	4 x 660 	2,640 	SGPC 	Private
Udupi Power Plant 	Nandicoor 	Udupi 	Karnataka 	Southern 	13°08′49″N 74°48′02″E 	2 x 600 	1,200 	Adani Power[26] 	Private
Singareni Thermal Power Plant 	Pegadapalli 	Mancherial 	Telangana 	Southern 		2 x 600 	1,200 	Singareni Collieries Company 	PSU
Adani Thermal Power Plant 	Godda 	Godda 	Jharkhand 	Eastern 		2 x 660 	1,320 	Adani Power Jharkhand Limited 	Private
Tuticorin Thermal Power Station 	Tuticorin 	Tuticorin 	Tamil Nadu 	Southern 	08°45′44″N 78°10′32″E 	5 x 210 	1,050 	TNEB 	State
Rayalaseema Thermal Power Station[27] 	Kadapa 	Kadapa 	Andhra Pradesh 	Southern 	14°42′14″N 78°27′29″E 	5 x 210 	1,050 	APGENCO 	State
Neyveli Thermal Power Station I 	Neyveli 	Cuddalore 	Tamil Nadu 	Southern 	11°35′34″N 79°28′17″E 	6 x 50$, 3 x 100$, 2 x 210 	420 	NLC 	Central
NTPL Thermal Power Station 	Thoothukudi 	Thoothukudi 	Tamil Nadu 	Southern 	8°45′32″N 78°10′54.8″E 	2 x 500 	1,000 	NLC & TNEB 	State & central
JSW Vijayanagar Power Station 	Toranagallu 	Bellary 	Karnataka 	Southern 	15°10′54″N 76°40′36″E 	2 x 130, 2 x 300 	860 	JSW Energy 	Private
Mettur Thermal Power Station 	Mettur 	Salem 	Tamil Nadu 	Southern 	11°46′19″N 77°48′49″E 	4 x 210, 1 x 600 	1,440 	TNEB 	State
North Chennai Thermal Power Station 	Athipattu 	Chennai 	Tamil Nadu 	Southern 	13°15′12″N 80°19′41″E 	3 x 210, 2 x 600 	1,830 	TNEB 	State
Mutiara Thermal Power Plant 	Thoothukudi 	Thoothukudi 	Tamil Nadu 	Southern 	8°54′52″N 78°08′40.2″E 	2 x 600 	1200 	Coastal Energen Private Limited (CEPL) 	Private
Cuddalore IL&FS Thermal Power Station 	Cuddalore 	Cuddalore 	Tamil Nadu 	Southern 		2 x 600 	1200 	IL&FS Tamil Nadu Power Company Limited (ITPCL) 	Private
Simhapuri Thermal Power Station 	Krishnapatnam 	Nellore 	Andhra Pradesh 	Southern 	14°12′35″N 80°05′23″E 	4 x 150 	600 	Simhapuri Energy Limited 	Private
Hinduja Thermal Power Station 	Devada 	Visakhapatnam 	Andhra Pradesh 	Southern 	17°33′45″N 83°8′15″E 	1 x 525 	525 	Hinduja National Power Corporation Limited 	Private
Kakatiya Thermal Power Station 	Chelpur 	Warangal 	Telangana 	Southern 	18°23′02″N 79°49′42″E 	1 x 500 	500 	TSGENCO 	State
Bellary Thermal Power station 	Kudatini 	Bellary 	Karnataka 	Southern 	15°11′37″N 76°43′16″E 	2 x 500 1x700 	1700 	KPCL 	State
Yermarus Thermal Power Station 	Yermarus 	Raichur 	Karnataka 	Southern 	16°17′39″N 77°21′19″E 	2 x 800 	1600 	KPCL 	State
Ennore Thermal Power Station 	Ennore 	Chennai 	Tamil Nadu 	Southern 	13°12′07″N 80°18′40″E 	2 x 60$, 3 x 110$ 		TNEB 	State
Ind-Barath Thermal Power Plant 	Tuticorin 	Tuticorin 	Tamil Nadu 	Southern 		2 x 150 	300 	Ind-Barath Power Infra Limited 	Private
Meenakshi Power Plant 	Krishnapatnam 	Nellore 	Andhra Pradesh 	Southern 	14°12′57″N 80°05′19″E 	2 x 150 	300 	MEPL 	Private
Neyveli Zero Lignite Power Station 	Neyveli 	Cuddalore 	Tamil Nadu 	Southern 	11°32′33″N 79°24′57″E 	1 x 250 	250 	TAQA 	Private
Ramagundam B Thermal Power Station 	Ramagundam 	Karimnagar 	Telangana 	Southern 	18°43′31″N 79°30′47″E 	1 x 62.5 	62.5 	TSGENCO 	State`;
const jsonData = processPowerStationsData(rawText);
fs.writeFileSync("./public/coal-plants.json", JSON.stringify(jsonData, null, 2));