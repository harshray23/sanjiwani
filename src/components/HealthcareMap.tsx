
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function HealthcareMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || mapRef.current) return;

    // Fix for default marker icons in Leaflet with Next.js
    // We do this inside useEffect to ensure window is defined
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

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
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Overpass API error:", response.status, errorText);
          return;
        }

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
        console.error("Failed to fetch or parse Overpass API data:", err);
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
          console.warn("Unable to access your location. Showing default area.");
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
      <div ref={containerRef} id="map" className="w-full h-full rounded-xl shadow-lg border border-accent/20" />
    </div>
  );
}
