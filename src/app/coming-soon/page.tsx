
"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function ComingSoonPage() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/Coming.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Error fetching animation:", error));
  }, []);

  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardHeader className="text-center">
             <CardTitle className="text-3xl font-headline">Feature Coming Soon!</CardTitle>
             <CardDescription>This feature is currently under development. Please check back later.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-64 h-64">
                {animationData && <Lottie animationData={animationData} loop={true} />}
            </div>
            <Button asChild className="mt-8">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Go Back to Home
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
