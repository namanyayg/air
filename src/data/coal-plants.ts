export interface CoalPlant {
  name: string;
  state: string;
  capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const coalPlants: CoalPlant[] = [
  {
    name: "Vindhyachal Thermal Power Station",
    state: "Madhya Pradesh",
    capacity: 4760,
    coordinates: { lat: 24.0987, lng: 82.6719 }
  },
  {
    name: "Mundra Thermal Power Station",
    state: "Gujarat",
    capacity: 4620,
    coordinates: { lat: 22.8397, lng: 69.7298 }
  },
  {
    name: "Talcher Super Thermal Power Station",
    state: "Odisha",
    capacity: 3000,
    coordinates: { lat: 20.9517, lng: 85.2163 }
  },
  {
    name: "Sipat Thermal Power Plant",
    state: "Chhattisgarh",
    capacity: 2980,
    coordinates: { lat: 22.0979, lng: 82.8780 }
  },
  {
    name: "Rihand Thermal Power Station",
    state: "Uttar Pradesh",
    capacity: 3000,
    coordinates: { lat: 24.1833, lng: 82.9833 }
  },
  {
    name: "Ramagundam Thermal Power Station",
    state: "Telangana",
    capacity: 2600,
    coordinates: { lat: 18.7569, lng: 79.4661 }
  },
  {
    name: "Korba Super Thermal Power Plant",
    state: "Chhattisgarh",
    capacity: 2600,
    coordinates: { lat: 22.3597, lng: 82.7520 }
  },
  {
    name: "Sasan Ultra Mega Power Project",
    state: "Madhya Pradesh",
    capacity: 3960,
    coordinates: { lat: 23.9985, lng: 82.6267 }
  },
  {
    name: "Tiroda Thermal Power Station",
    state: "Maharashtra",
    capacity: 3300,
    coordinates: { lat: 21.4069, lng: 79.9225 }
  },
  {
    name: "Kudgi Super Thermal Power Plant",
    state: "Karnataka",
    capacity: 2400,
    coordinates: { lat: 16.9252, lng: 75.9980 }
  }
]; 