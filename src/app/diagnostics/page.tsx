
"use client";

import { useEffect, useState, useMemo } from 'react';
import { getDiagnosticsCentres, comprehensiveTests } from '@/lib/data';
import type { DiagnosticsCentre } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FlaskConical, MapPin, Search, Star, Filter } from 'lucide-react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const CentreCard = ({ centre }: { centre: DiagnosticsCentre }) => (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-0">
            <Image
                src={centre.imageUrl}
                alt={centre.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
                data-ai-hint={centre.dataAiHint}
            />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-headline mb-2 truncate">{centre.name}</CardTitle>
            <CardDescription className="flex items-center text-sm mb-3">
                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                {centre.location}
            </CardDescription>
            <div className="flex items-center gap-2 mb-4">
                <Badge variant="default" className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-300 text-yellow-300"/> {centre.rating}
                </Badge>
            </div>
             <div>
                {centre.tests.slice(0, 3).map(test => (
                    <Badge key={test.id} variant="secondary" className="mr-1 mb-1">{test.name}</Badge>
                ))}
                {centre.tests.length > 3 && <Badge variant="secondary">+{centre.tests.length-3} more</Badge>}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button asChild className="w-full">
                <Link href={`/diagnostics/${centre.id}`}>View Tests & Book</Link>
            </Button>
        </CardFooter>
    </Card>
);


export default function DiagnosticsPage() {
    const [centres, setCentres] = useState<DiagnosticsCentre[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTestCategory, setActiveTestCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCentres = async () => {
            setIsLoading(true);
            const data = await getDiagnosticsCentres();
            setCentres(data);
            setIsLoading(false);
        };
        fetchCentres();
    }, []);

    const uniqueTestCategories = useMemo(() => {
        const categories = new Set<string>();
        comprehensiveTests.forEach(test => categories.add(test.category));
        return Array.from(categories);
    }, []);

    const testCategoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        uniqueTestCategories.forEach(cat => counts[cat] = 0);
        centres.forEach(centre => {
            const centreCategories = new Set(centre.tests.map(t => t.category));
            centreCategories.forEach(cat => {
                if (counts[cat] !== undefined) {
                    counts[cat]++;
                }
            });
        });
        return counts;
    }, [centres, uniqueTestCategories]);

    const filteredCentres = useMemo(() => {
        let results = centres;

        // Apply category filter first
        if (activeTestCategory) {
            results = results.filter(centre => 
                centre.tests.some(test => test.category === activeTestCategory)
            );
        }
        
        // Then apply search query on the (potentially filtered) results
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            results = results.filter(centre => 
                centre.name.toLowerCase().includes(lowerCaseQuery) ||
                centre.location.toLowerCase().includes(lowerCaseQuery) ||
                centre.tests.some(test => test.name.toLowerCase().includes(lowerCaseQuery))
            );
        }

        return results;
    }, [centres, activeTestCategory, searchQuery]);


    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            <Card className="mb-8 shadow-lg bg-primary/5 border-primary/20">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-accent/10 p-3 rounded-full w-fit mb-4">
                        <FlaskConical className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle className="text-3xl font-headline text-accent">Find a Diagnostics Centre</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">Search for labs and book tests with ease.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-2xl mx-auto">
                        <Input
                            placeholder="Search by centre name, test, or location..."
                            className="h-12 text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" size="lg">
                            <Search />
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
                        <div className="flex items-center gap-4">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="mr-2 h-4 w-4"/>
                                        {activeTestCategory || "Filter by Test Category"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 max-h-96 overflow-y-auto">
                                    <DropdownMenuLabel>Filter by Test Category</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={activeTestCategory || "All"} onValueChange={(value) => setActiveTestCategory(value === "All" ? null : value)}>
                                        <DropdownMenuRadioItem value="All">All ({centres.length})</DropdownMenuRadioItem>
                                        {uniqueTestCategories.map(category => (
                                            <DropdownMenuRadioItem key={category} value={category}>
                                                {category} ({testCategoryCounts[category] || 0})
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {activeTestCategory && (
                                <Button variant="ghost" onClick={() => setActiveTestCategory(null)}>Clear Filter</Button>
                            )}
                        </div>
                    </div>

                    {filteredCentres.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCentres.map(centre => (
                                <CentreCard key={centre.id} centre={centre} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-16 text-muted-foreground bg-card rounded-lg shadow-md">
                            {activeTestCategory || searchQuery
                                ? `No diagnostics centres found matching your criteria.`
                                : "No diagnostics centres found."
                            }
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
