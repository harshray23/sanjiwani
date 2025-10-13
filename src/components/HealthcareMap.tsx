
"use client";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Button } from "./ui/button";
import { LocateIcon } from "lucide-react";

// Fix for default icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


// --- helper hook to center map on user ---
function LocateUser() {
  const map = useMap();

  const locateUser = () => {
     if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 14);
          L.marker([latitude, longitude], {
            icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [35, 35],
            })
          })
            .addTo(map)
            .bindPopup("📍 You are here")
            .openPopup();

          fetchNearbyPlaces(latitude, longitude, map);
        },
        () => alert("Unable to retrieve your location. Please enable location services.")
      );
    }
  }
  
  useEffect(() => {
    // Locate the user automatically on initial load
    locateUser();
  }, [map]);

  return (
      <Button
        onClick={locateUser}
        className="absolute top-4 right-4 z-[1000] shadow-lg"
        variant="default"
        size="icon"
      >
        <LocateIcon className="h-5 w-5" />
        <span className="sr-only">Find My Location</span>
      </Button>
  );
}

// --- fetch nearby hospitals/clinics/doctors ---
async function fetchNearbyPlaces(lat: number, lon: number, map: L.Map) {
  const radius = 5000; // meters
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      node["amenity"="clinic"](around:${radius},${lat},${lon});
      node["amenity"="doctors"](around:${radius},${lat},${lon});
      node["healthcare"="diagnostic_centre"](around:${radius},${lat},${lon});
    );
    out;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    data.elements.forEach((place: any) => {
      const name = place.tags.name || "Unnamed";
      const type = place.tags.amenity || place.tags.healthcare.replace('_', ' ');
      L.marker([place.lat, place.lon])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br><span style="text-transform: capitalize;">${type}</span>`);
    });
  } catch (err) {
    console.error("Overpass API error:", err);
  }
}

export default function HealthcareMap() {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[20.5937, 78.9629]} // Default to center of India
        zoom={5}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateUser />
      </MapContainer>
    </div>
  );
}
