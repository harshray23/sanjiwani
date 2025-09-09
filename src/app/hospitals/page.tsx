
"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchHospitals, getHospitals, comprehensiveSpecialties } from '@/lib/data';
import type { Hospital } from '@/lib/types';
import { HospitalCard } from '@/components/HospitalCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Siren, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

function HospitalSearch() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      const data = initialQuery ? await searchHospitals(initialQuery) : await getHospitals();
      setHospitals(data);
      setIsLoading(false);
    };
    fetchResults();
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Use window.location to trigger a page reload with new search params,
    // which re-runs the useEffect hook.
    window.location.href = `/hospitals?query=${encodeURIComponent(searchQuery)}`;
  };
  
  const filteredHospitals = useMemo(() => {
    if (!activeSpecialty) {
        return hospitals;
    }
    return hospitals.filter(hospital => hospital.specialties.includes(activeSpecialty));
  }, [hospitals, activeSpecialty]);


  return (
    <div className="w-full max-w-7xl mx-auto py-8">
       <Card className="mb-8 shadow-lg bg-primary/5 border-primary/20">
        <CardHeader className="text-center">
            <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
                <Siren className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-headline text-accent">Find a Hospital</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">Search for hospitals and check real-time bed availability.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by hospital name, specialty, or location..."
                    className="h-12 text-base"
                />
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
                </Button>
            </form>
        </CardContent>
       </Card>


      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" />
        </div>
      ) : (
        <div>
           <div className="my-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-primary"/>
                    <h3 className="text-md font-semibold text-accent">Filter by Specialization</h3>
                </div>
                 <div className="flex flex-wrap gap-2">
                    <Button
                        variant={!activeSpecialty ? 'default' : 'outline'}
                        onClick={() => setActiveSpecialty(null)}
                        size="sm"
                    >
                        All
                    </Button>
                    {comprehensiveSpecialties.map(specialty => (
                        <Button
                            key={specialty}
                            variant={activeSpecialty === specialty ? 'default' : 'outline'}
                            onClick={() => setActiveSpecialty(specialty)}
                            size="sm"
                        >
                            {specialty}
                        </Button>
                    ))}
                </div>
            </div>
          {filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-muted-foreground bg-card rounded-lg shadow-md">
                {activeSpecialty
                    ? `No hospitals found for the specialization "${activeSpecialty}".`
                    : "No hospitals found matching your search. Try a different query."
                }
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function HospitalsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Lottie animationData={loadingAnimation} loop={true} className="w-48 h-48" /></div>}>
            <HospitalSearch />
        </Suspense>
    );
}
