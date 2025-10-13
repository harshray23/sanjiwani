"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Next.js bundling
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

export default function HealthcareMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Clean up any previous Leaflet map instance bound to this container
    if (containerRef.current && containerRef.current.hasChildNodes()) {
      containerRef.current.replaceChildren(); // clears DOM safely
    }

    // Ensure we only init once per component mount
    if (!mapRef.current && containerRef.current) {
      const map = L.map(containerRef.current, {
        center: [20.5937, 78.9629], // Default center (India)
        zoom: 5,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Locate the user
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            map.setView([lat, lon], 14);
            L.marker([lat, lon])
              .addTo(map)
              .bindPopup("📍 You are here")
              .openPopup();
          },
          () => alert("Unable to retrieve your location.")
        );
      }
    }

    // Cleanup: fully remove the map before unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        id="map"
        className="w-full h-full rounded-xl shadow-lg"
      />
    </div>
  );
}
