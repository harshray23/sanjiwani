
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, FileUp, Hash, ExternalLink, ArrowLeft } from "lucide-react";
import { anchorDataToAvalanche } from '@/lib/blockchain';
import { createVerifiedRecord } from '@/lib/data';
import type { User } from '@/lib/types';
import Link from 'next/link';

export default function UploadRecordPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setForm] = useState({
    patientName: '',
    age: '',
    hospitalName: '',
    testType: '',
    testDate: new Date().toISOString().split('T')[0]
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push('/login');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!file) {
      toast({ title: "No file selected", description: "Please upload a report file.", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      // Step 1: Create cryptographic hash of metadata + file name
      const metadata = { ...formData, fileName: file.name };
      
      // Step 2: Anchor to Avalanche
      const anchorResult = await anchorDataToAvalanche(metadata);
      
      // Step 3: Save to Data Layer (simulated Firestore)
      await createVerifiedRecord(
        user.uid,
        {
          patientName: formData.patientName,
          age: parseInt(formData.age),
          hospitalName: formData.hospitalName,
          testType: formData.testType,
          testDate: formData.testDate,
          fileUrl: URL.createObjectURL(file) // Mock URL
        },
        anchorResult.hash,
        anchorResult.txId
      );

      toast({
        title: "Record Verified & Stored!",
        description: "Your report has been anchored to Avalanche Fuji.",
      });

      router.push('/records');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Ensure MetaMask is on Fuji Testnet.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="py-12 w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/records"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Records</Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline text-accent">Upload Medical Record</h1>
        <p className="text-muted-foreground">Prove the authenticity of your medical reports using blockchain verification.</p>
      </div>

      <Card className="shadow-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="text-primary"/>
              Record Details
            </CardTitle>
            <CardDescription>All details below will be hashed and anchored to the Avalanche C-Chain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" required value={formData.patientName} onChange={e => setForm({...formData, patientName: e.target.value})} placeholder="e.g. John Doe"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" required value={formData.age} onChange={e => setForm({...formData, age: e.target.value})} placeholder="30"/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input id="hospitalName" required value={formData.hospitalName} onChange={e => setForm({...formData, hospitalName: e.target.value})} placeholder="e.g. Metro General Hospital"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Input id="testType" required value={formData.testType} onChange={e => setForm({...formData, testType: e.target.value})} placeholder="e.g. Blood Test, MRI, X-Ray"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testDate">Date of Test</Label>
                <Input id="testDate" type="date" required value={formData.testDate} onChange={e => setForm({...formData, testDate: e.target.value})}/>
              </div>
            </div>
            <div className="space-y-2 border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
              <Label htmlFor="file" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-2"/>
                  <span className="text-sm font-medium">{file ? file.name : "Click to upload Report (PDF/Image)"}</span>
                </div>
              </Label>
              <Input id="file" type="file" className="hidden" accept=".pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)}/>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 text-lg" disabled={isVerifying}>
              {isVerifying ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Anchoring to Avalanche...</>
              ) : (
                <><ShieldCheck className="mr-2 h-5 w-5"/> Submit & Verify on Blockchain</>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground italic">
              <strong>Why this matters:</strong> Once anchored, this record's fingerprint is permanent. No one can silently alter your medical history.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
