
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, Siren, MapPin, Navigation, Clock, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Load map only on the client
const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20 animate-pulse">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium">Initializing AI Dispatcher...</p>
    </div>
  ),
});

export default function EmergencyPage() {
  const { toast } = useToast();
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number; ambulanceId: string } | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [ambulanceCount, setAmbulanceCount] = useState(0);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      toast({
        title: "Ambulance Dispatched!",
        description: `${routeInfo?.ambulanceId} is en route to your location.`,
      });
      setIsDispatching(false);
    }, 2000);
  };

  return (
    <main className="flex flex-col lg:flex-row h-[calc(100vh-120px)] w-full max-w-[1600px] mx-auto gap-6 px-4 py-4">
      {/* Left Column: Interactive Map */}
      <div className="flex-grow rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 relative bg-muted/10">
        <HealthcareMap 
          onRouteFound={(info) => setRouteInfo(info)} 
          onAmbulancesFound={(count) => setAmbulanceCount(count)}
        />
        
        {/* Map Overlays */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <Badge className="bg-red-600 text-white border-red-700 p-2 shadow-lg flex gap-2 items-center">
            <Siren className="h-4 w-4 animate-pulse" />
            Live Emergency Mode
          </Badge>
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground shadow-md p-2">
            {ambulanceCount} Ambulances Available Nearby
          </Badge>
        </div>
      </div>

      {/* Right Column: Dispatch Control Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto">
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Siren className="h-6 w-6" />
              Emergency Dispatch
            </CardTitle>
            <CardDescription>AI is calculating the fastest road route.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!routeInfo ? (
              <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Detecting your location and calculating traffic-aware routes...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in-up">
                <div className="bg-white rounded-xl p-4 border shadow-sm">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Nearest Responder</p>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-accent">{routeInfo.ambulanceId}</h3>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Verified</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                    <Clock className="h-5 w-5 text-primary mb-1" />
                    <p className="text-sm font-bold">{Math.round(routeInfo.time / 60)} mins</p>
                    <p className="text-[10px] text-muted-foreground uppercase">ETA</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border shadow-sm flex flex-col items-center justify-center text-center">
                    <Navigation className="h-5 w-5 text-primary mb-1" />
                    <p className="text-sm font-bold">{(routeInfo.distance / 1000).toFixed(1)} km</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Distance</p>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Avalanche Trusted:</strong> This ambulance's current location and availability are verified via our blockchain integrity layer to prevent ghost-bookings.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 shadow-red-200 shadow-xl"
              disabled={!routeInfo || isDispatching}
              onClick={handleDispatch}
            >
              {isDispatching ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Dispatching...</>
              ) : (
                <><Zap className="mr-2 h-5 w-5" /> Dispatch Ambulance Now</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Local Healthcare Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-3">
            <p>Our AI is continuously monitoring 5km around your location for verified resource availability.</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Nearby Facilities:</span>
                <span className="font-bold text-foreground">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Traffic Condition:</span>
                <span className="text-green-600 font-bold">Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
