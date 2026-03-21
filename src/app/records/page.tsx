
"use client";

import { useEffect, useState } from 'react';
import { getMedicalRecords } from '@/lib/data';
import type { MedicalRecord, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, ShieldCheck, Hash, ExternalLink, Search, Clock, User as UserIcon } from "lucide-react";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';

export default function RecordsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(currentUser);

    if (currentUser) {
      getMedicalRecords(currentUser.uid).then(data => {
        setRecords(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-screen">
        <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
        <p className="mt-4 text-muted-foreground">Loading Your Verified Records...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-12 bg-card rounded-xl shadow-lg border max-w-md mx-auto my-20">
        <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verified Health Vault</h2>
        <p className="text-muted-foreground mb-6">Log in to access your blockchain-verified medical records and proofs.</p>
        <Button asChild className="w-full">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 w-full max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline text-accent">Medical Proofs</h1>
          <p className="text-lg text-muted-foreground">Immutable audit trail of your medical history on Avalanche.</p>
        </div>
        <Button asChild size="lg" className="shadow-lg">
          <Link href="/records/upload">
            <PlusCircle className="mr-2 h-5 w-5"/> Upload & Verify
          </Link>
        </Button>
      </div>

      {records.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20"/>
          <h3 className="text-xl font-bold mb-2">No Verified Records Found</h3>
          <p className="text-muted-foreground mb-6">Upload your first report to start building your trusted medical identity.</p>
          <Button asChild variant="outline">
            <Link href="/records/upload">Get Started</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {records.map(record => (
            <Card key={record.id} className="overflow-hidden border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-green-600"/>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-headline">{record.testType}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-3 w-3"/> Verified on {new Date(record.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600">On-Chain Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Patient</p>
                  <p className="font-semibold flex items-center gap-2"><UserIcon className="h-4 w-4"/> {record.patientName} ({record.age}y)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Facility</p>
                  <p className="font-semibold">{record.hospitalName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Test Date</p>
                  <p className="font-semibold">{record.testDate}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t py-3 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Hash className="h-3 w-3"/> Fingerprint: {record.onChainHash.slice(0, 16)}...
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <Link href={`https://testnet.snowtrace.io/tx/${record.txHash}`} target="_blank">
                      <ExternalLink className="mr-2 h-3 w-3"/> View Avalanche Proof
                    </Link>
                  </Button>
                  <Button size="sm" variant="secondary" className="flex-1 sm:flex-none">
                    View Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
