
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchHospitals, getHospitals } from '@/lib/mock-data';
import type { Hospital } from '@/lib/types';
import { HospitalCard } from '@/components/HospitalCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, Siren } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

function HospitalSearch() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

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
          {hospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-muted-foreground bg-card rounded-lg shadow-md">
              No hospitals found matching your search. Try a different query.
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

    