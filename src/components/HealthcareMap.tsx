"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons in Next.js
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

// --- LocateUser helper ---
function LocateUser() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;
    let isMounted = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isMounted) return;
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();
      },
      () => alert("Unable to retrieve your location.")
    );

    return () => {
      isMounted = false;
    };
  }, [map]);

  return null;
}

// --- Main Map Component ---
export default function HealthcareMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure code runs only in browser, not during SSR
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-[100vh]">
      <MapContainer
        // 👇 key ensures full remount if needed
        key="unique-map"
        center={[20.5937, 78.9629]} // Default: center of India
        zoom={5}
        className="w-full h-full rounded-xl shadow-lg"
        whenReady={(mapInstance) => {
          // Defensive: destroy any pre-existing map
          const container = mapInstance.target.getContainer();
          if (container._leaflet_id) {
            try {
              mapInstance.target.remove();
            } catch (_) {}
          }
        }}
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
