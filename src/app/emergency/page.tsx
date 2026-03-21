"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Siren, MapPin, Navigation, Clock, Zap, ShieldCheck, Hospital as HospitalIcon, BedDouble, Droplet, SearchCheck, ExternalLink, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getHospitals, getDonorsByGroup } from "@/lib/data";
import { Hospital, Donor } from "@/lib/types";
import { BloodInventoryDisplay } from "@/components/BloodInventory";
import Link from "next/link";

const HealthcareMap = dynamic(() => import("@/components/HealthcareMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium">Initializing AI Dispatcher...</p>
    </div>
  ),
});

function EmergencyContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const severity = searchParams.get('severity') || 'Unknown';
  const requiredBlood = searchParams.get('bloodGroup') || null;
  const icuRequired = searchParams.get('icu') === 'true';
  const specialty = searchParams.get('specialty') || 'Emergency';

  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number; ambulanceId: string } | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [ambulanceCount, setAmbulanceCount] = useState(0);
  const [bestHospital, setBestHospital] = useState<Hospital | null>(null);
  const [alternativeHospital, setAlternativeHospital] = useState<Hospital | null>(null);
  const [matchingDonors, setMatchingDonors] = useState<Donor[]>([]);
  const [isSearchingResources, setIsSearchingResources] = useState(true);

  const findBestHospital = useCallback(async () => {
    setIsSearchingResources(true);
    const hospitals = await getHospitals();
    
    // 1. Find hospitals with required bed + blood
    const filtered = hospitals.filter(h => {
      const hasBed = icuRequired ? h.beds.icu.available > 0 : h.beds.general.available > 0;
      const hasBlood = requiredBlood ? (h.bloodInventory?.[requiredBlood as keyof typeof h.bloodInventory] || 0) > 0 : true;
      return hasBed && hasBlood;
    });

    if (filtered.length > 0) {
      setBestHospital(filtered[0]);
      if (filtered.length > 1) setAlternativeHospital(filtered[1]);
    } else {
      // 2. If blood missing, find any hospital with bed and look for donors
      const withBed = hospitals.filter(h => icuRequired ? h.beds.icu.available > 0 : h.beds.general.available > 0);
      if (withBed.length > 0) {
        setBestHospital(withBed[0]);
        if (requiredBlood) {
          const donors = await getDonorsByGroup(requiredBlood);
          setMatchingDonors(donors);
        }
      }
    }
    setIsSearchingResources(false);
  }, [icuRequired, requiredBlood]);

  useEffect(() => {
    findBestHospital();
  }, [findBestHospital]);

  const handleRouteFound = useCallback((info: { distance: number; time: number; ambulanceId: string }) => {
    setRouteInfo(info);
  }, []);

  const handleAmbulancesFound = useCallback((count: number) => {
    setAmbulanceCount(count);
  }, []);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      toast({
        title: "Ambulance Dispatched!",
        description: `${routeInfo?.ambulanceId} is en route to ${bestHospital?.name}.`,
      });
      setIsDispatching(false);
    }, 2000);
  };

  return (
    <main className="flex flex-col lg:flex-row h-[calc(100vh-120px)] w-full max-w-[1600px] mx-auto gap-6 px-4 py-4">
      {/* Left Column: Mission Control Map */}
      <div className="flex-grow rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 relative bg-muted/10">
        <HealthcareMap 
          onRouteFound={handleRouteFound} 
          onAmbulancesFound={handleAmbulancesFound}
        />
        
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <Badge className="bg-red-600 text-white border-red-700 p-2 shadow-lg flex gap-2 items-center">
            <Siren className="h-4 w-4 animate-pulse" />
            Live Emergency Mode: {severity} Risk
          </Badge>
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground shadow-md p-2">
            {ambulanceCount} Verified Ambulances Online
          </Badge>
        </div>
      </div>

      {/* Right Column: Resource Dashboard */}
      <div className="w-full lg:w-[450px] flex flex-col gap-4 overflow-y-auto">
        {/* Triage Summary */}
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <SearchCheck className="h-4 w-4" />
              Triage Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white">Specialty: {specialty}</Badge>
              <Badge variant="outline" className="bg-white">{icuRequired ? 'ICU Bed Needed' : 'General Bed Needed'}</Badge>
              {requiredBlood && <Badge className="bg-red-600">Req. Blood: {requiredBlood}</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Resources */}
        <Card className="flex-grow border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <HospitalIcon className="h-5 w-5 text-accent" />
              Resource Matching
            </CardTitle>
            <CardDescription>AI-identified hospital with verified capacity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSearchingResources ? (
              <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Checking Avalanche-verified bed and blood status...</p>
              </div>
            ) : bestHospital ? (
              <div className="space-y-4">
                <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl text-accent">{bestHospital.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> {bestHospital.location.address}</p>
                    </div>
                    <Badge className="bg-green-600">Best Match</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white p-2 rounded-lg border flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">ICU Beds</p>
                        <p className="text-sm font-bold">{bestHospital.beds.icu.available}</p>
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Verified</p>
                        <p className="text-xs font-bold">5 mins ago</p>
                      </div>
                    </div>
                  </div>

                  {bestHospital.bloodInventory && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-red-600"/> Blood Bank Status
                      </p>
                      <BloodInventoryDisplay inventory={bestHospital.bloodInventory} />
                      {requiredBlood && (bestHospital.bloodInventory[requiredBlood as keyof typeof bestHospital.bloodInventory] || 0) === 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-[10px] text-red-700 font-bold uppercase">Blood Deficit Alert</p>
                            <p className="text-[10px] text-red-600">Hospital is out of {requiredBlood}. Looking for nearby donors...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {matchingDonors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Nearby Verified Donors ({requiredBlood})</h4>
                    {matchingDonors.map(donor => (
                      <div key={donor.id} className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm">
                        <div>
                          <p className="text-sm font-bold">{donor.name}</p>
                          <p className="text-[10px] text-muted-foreground">{donor.location.address}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-[10px] h-7">Request Match</Button>
                      </div>
                    ))}
                  </div>
                )}

                {alternativeHospital && (
                  <div className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Alternative Facility</h4>
                    <div className="p-3 border rounded-lg bg-muted/20 flex justify-between items-center">
                      <p className="text-sm font-bold">{alternativeHospital.name}</p>
                      <Link href={`/emergency?severity=${severity}&bloodGroup=${requiredBlood}&icu=${icuRequired}`} className="text-xs text-primary underline">Switch</Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No facilities found meeting all criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dispatch Action */}
        <Card className="border-red-600 shadow-xl shadow-red-100">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-5 w-5 text-primary mb-1" />
                <p className="text-lg font-bold">{routeInfo ? Math.round(routeInfo.time / 60) : '--'} mins</p>
                <p className="text-[10px] text-muted-foreground uppercase">Fastest ETA</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Navigation className="h-5 w-5 text-primary mb-1" />
                <p className="text-lg font-bold">{routeInfo ? (routeInfo.distance / 1000).toFixed(1) : '--'} km</p>
                <p className="text-[10px] text-muted-foreground uppercase">Distance</p>
              </div>
            </div>
            
            <Button 
              className="w-full h-16 text-xl font-bold bg-red-600 hover:bg-red-700 shadow-red-200 shadow-2xl animate-pulse"
              disabled={!routeInfo || isDispatching || !bestHospital}
              onClick={handleDispatch}
            >
              {isDispatching ? (
                <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Dispatching...</>
              ) : (
                <><Zap className="mr-2 h-6 w-6" /> Dispatch Ambulance</>
              )}
            </Button>
            
            <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-accent" />
              <span>Avalanche Trust Protocol Enabled</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary"/></div>}>
      <EmergencyContent />
    </Suspense>
  );
}
