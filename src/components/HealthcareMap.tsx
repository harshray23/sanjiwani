
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix for default marker icons in Leaflet
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface Ambulance {
  id: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy';
}

interface RouteSummary {
  distance: number; // meters
  time: number; // seconds
  ambulanceId: string;
}

interface HealthcareMapProps {
  onRouteFound?: (summary: RouteSummary) => void;
  onAmbulancesFound?: (count: number) => void;
}

export default function HealthcareMap({ onRouteFound, onAmbulancesFound }: HealthcareMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<any>(null);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!containerRef.current || mapRef.current) return;

    fixLeafletIcons();

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

    // Haversine distance for initial quick filtering (meters)
    const getHaversineDistance = (p1: [number, number], p2: [number, number]) => {
      const R = 6371e3; // metres
      const φ1 = p1[0] * Math.PI/180;
      const φ2 = p2[0] * Math.PI/180;
      const Δφ = (p2[0]-p1[0]) * Math.PI/180;
      const Δλ = (p2[1]-p1[1]) * Math.PI/180;
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const setupRouting = (start: [number, number], end: [number, number], ambId: string) => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        show: false, // Hide the instruction panel
        lineOptions: {
          styles: [{ color: '#f97316', weight: 6, opacity: 0.8 }]
        }
      }).addTo(map);

      routingControlRef.current = control;

      control.on('routesfound', (e: any) => {
        const route = e.routes[0];
        if (onRouteFound) {
          onRouteFound({
            distance: route.summary.totalDistance,
            time: route.summary.totalTime,
            ambulanceId: ambId
          });
        }
      });
    };

    const generateMockAmbulances = (lat: number, lon: number) => {
      const ambs: Ambulance[] = [
        { id: 'AMB-101', lat: lat + 0.015, lng: lon + 0.01, status: 'available' },
        { id: 'AMB-202', lat: lat - 0.01, lng: lon + 0.02, status: 'available' },
        { id: 'AMB-303', lat: lat + 0.005, lng: lon - 0.015, status: 'available' },
      ];

      ambs.forEach(amb => {
        const ambIcon = L.divIcon({
          html: `<div class="bg-white p-1 rounded-full shadow-lg border-2 border-red-500 flex items-center justify-center w-8 h-8">🚑</div>`,
          className: 'custom-amb-icon',
          iconSize: [32, 32]
        });

        L.marker([amb.lat, amb.lng], { icon: ambIcon })
          .addTo(map)
          .bindPopup(`<b>Ambulance ${amb.id}</b><br/>Status: ${amb.status}`);
      });

      if (onAmbulancesFound) onAmbulancesFound(ambs.length);

      // Find nearest using road routing logic
      // For demo: pick the one with smallest straight line distance then run road route
      const nearest = ambs.sort((a, b) => 
        getHaversineDistance([lat, lon], [a.lat, a.lng]) - 
        getHaversineDistance([lat, lon], [b.lat, b.lng])
      )[0];

      if (nearest) {
        setupRouting([nearest.lat, nearest.lng], [lat, lon], nearest.id);
      }
    };

    const fetchNearbyHealthcare = async (lat: number, lon: number) => {
      const radius = 5000;
      const overpassQuery = `[out:json];(node["amenity"="hospital"](around:${radius},${lat},${lon});node["amenity"="clinic"](around:${radius},${lat},${lon}););out center;`;

      try {
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery,
        });
        const data = await response.json();
        if (!isMounted || !mapRef.current) return;

        data.elements.forEach((el: any) => {
          if (el.lat && el.lon) {
            const hospitalIcon = L.divIcon({
              html: `<div class="bg-white p-1 rounded-full shadow-lg border-2 border-blue-500 flex items-center justify-center w-8 h-8">🏥</div>`,
              className: 'custom-hosp-icon',
              iconSize: [32, 32]
            });
            L.marker([el.lat, el.lon], { icon: hospitalIcon })
              .addTo(mapRef.current!)
              .bindPopup(`<b>${el.tags?.name || "Healthcare Facility"}</b>`);
          }
        });
      } catch (err) { console.error(err); }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!isMounted || !mapRef.current) return;
          const { latitude: lat, longitude: lon } = pos.coords;
          setUserLoc([lat, lon]);
          mapRef.current.setView([lat, lon], 14);

          L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup("📍 Your Location (Emergency Origin)")
            .openPopup();

          generateMockAmbulances(lat, lon);
          fetchNearbyHealthcare(lat, lon);
        },
        () => {
          console.warn("Location access denied.");
          const defaultLoc: [number, number] = [28.6139, 77.2090]; // Delhi
          setUserLoc(defaultLoc);
          mapRef.current?.setView(defaultLoc, 14);
          generateMockAmbulances(defaultLoc[0], defaultLoc[1]);
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
  }, [onRouteFound, onAmbulancesFound]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} id="map" className="w-full h-full rounded-xl shadow-lg border border-accent/20" />
    </div>
  );
}
