"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix default Leaflet icons for Next.js bundling
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

export default function HealthcareMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // If already initialized, do nothing
    if (mapRef.current || !containerRef.current) return;

    // Initialize map once
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629], // Default center: India
      zoom: 5,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // ✅ Track whether component is still mounted
    let isMounted = true;

    // ✅ Safe geolocation handling
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted || !mapRef.current) return; // guard against unmount
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          mapRef.current.setView([lat, lon], 14);
          L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup("📍 You are here")
            .openPopup();
        },
        () => alert("Unable to retrieve your location.")
      );
    }

    // ✅ Cleanup on unmount
    return () => {
      isMounted = false;
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
