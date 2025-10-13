"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Use public paths for marker icons
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});


export default function HealthcareMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      center: [20.5937, 78.9629], // Default: India
      zoom: 5,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let isMounted = true;

    // ✅ Helper: Fetch healthcare data from Overpass API
    const fetchNearbyHealthcare = async (lat: number, lon: number) => {
      const radius = 5000; // meters (5 km)
      const overpassQuery = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lon});
          node["amenity"="clinic"](around:${radius},${lat},${lon});
          node["amenity"="doctors"](around:${radius},${lat},${lon});
          node["healthcare"="diagnostic"](around:${radius},${lat},${lon});
        );
        out center;
      `;

      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery,
        });
        const data = await response.json();

        if (!isMounted || !mapRef.current) return;

        // Add markers for results
        data.elements.forEach((el: any) => {
          if (el.lat && el.lon) {
            const name = el.tags?.name || "Unnamed Facility";
            const type =
              el.tags?.amenity ||
              el.tags?.healthcare ||
              "Healthcare Facility";

            L.marker([el.lat, el.lon])
              .addTo(mapRef.current!)
              .bindPopup(`<b>${name}</b><br/>Type: ${type}`);
          }
        });
      } catch (err) {
        console.error("Overpass API error:", err);
      }
    };

    // ✅ Use user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (!isMounted || !mapRef.current) return;
          const { latitude: lat, longitude: lon } = pos.coords;
          mapRef.current.setView([lat, lon], 14);

          L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup("📍 You are here")
            .openPopup();

          await fetchNearbyHealthcare(lat, lon);
        },
        () => {
          alert("Unable to access your location. Showing default area.");
          fetchNearbyHealthcare(20.5937, 78.9629);
        }
      );
    }

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
      <div ref={containerRef} id="map" className="w-full h-full rounded-xl shadow-lg" />
    </div>
  );
}
