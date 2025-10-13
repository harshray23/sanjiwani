"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons when bundling with Next.js
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

function LocateUser() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        map.setView([lat, lon], 14);
        L.marker([lat, lon]).addTo(map).bindPopup("📍 You are here").openPopup();
      },
      () => alert("Unable to retrieve your location.")
    );
  }, [map]);

  return null;
}

export default function HealthcareMap() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ⚠️ Render nothing until the component has mounted in the browser
  if (!mounted) return null;

  return (
    <div className="relative w-full h-full">
      {/* key forces a full remount if hot-reloaded */}
      <MapContainer
        key="healthcare-map"
        center={[20.5937, 78.9629]}  // Default center (India)
        zoom={5}
        className="w-full h-full rounded-xl shadow-lg"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateUser />
      </MapContainer>
    </div>
  );
}
