"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Activity, ShieldAlert, HeartPulse, Send, ArrowRight } from "lucide-react";
import { performTriage } from '@/ai/flows/triage-flow';
import { useToast } from '@/hooks/use-toast';

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleTriage = async () => {
    if (symptoms.length < 10) {
      toast({ title: "More detail needed", description: "Please describe your symptoms in at least 10 characters.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const triageResult = await performTriage({ symptoms });
      setResult(triageResult);
    } catch (error) {
      toast({ title: "Analysis Failed", description: "AI service is currently busy. Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const goToEmergency = () => {
    const params = new URLSearchParams({
      severity: result.severity,
      bloodGroup: result.recommendedResources.bloodGroup || '',
      icu: result.recommendedResources.icuBed ? 'true' : 'false',
      specialty: result.recommendedResources.specialty
    });
    router.push(`/emergency?${params.toString()}`);
  };

  return (
    <div className="py-12 w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <Activity className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-accent">Smart Symptom Triage</h1>
        <p className="text-lg text-muted-foreground mt-2">AI-driven analysis to connect you with the right emergency resources instantly.</p>
      </div>

      {!result ? (
        <Card className="shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
            <CardDescription>Describe your symptoms in detail (e.g., "Sharp chest pain for 30 minutes, spreading to left arm").</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Enter symptoms here..." 
              className="min-h-[150px] text-lg"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> This is an AI-powered triage tool, not a professional medical diagnosis. In case of life-threatening emergencies, call 108 immediately.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-14 text-lg font-bold" onClick={handleTriage} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Symptoms...</>
              ) : (
                <><HeartPulse className="mr-2 h-5 w-5" /> Start AI Triage</>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="animate-fade-in-up space-y-6">
          <Card className={`shadow-xl border-2 ${result.severity === 'High' ? 'border-red-500 bg-red-50/10' : 'border-primary/20'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-headline">Triage Assessment</CardTitle>
                <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${
                  result.severity === 'High' ? 'bg-red-600 text-white' : 
                  result.severity === 'Medium' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {result.severity} Risk
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Possible Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {result.possibleConditions.map((c: string) => (
                    <div key={c} className="bg-white dark:bg-card px-3 py-1 rounded border text-sm font-medium">{c}</div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-card p-4 rounded-lg border shadow-sm">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Resource Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>ICU Bed Required:</span>
                      <span className="font-bold">{result.recommendedResources.icuBed ? 'YES' : 'NO'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Target Specialty:</span>
                      <span className="font-bold text-primary">{result.recommendedResources.specialty}</span>
                    </li>
                    {result.recommendedResources.bloodGroup && (
                      <li className="flex justify-between">
                        <span>Blood Group Needed:</span>
                        <span className="font-bold text-red-600">{result.recommendedResources.bloodGroup}</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="bg-white dark:bg-card p-4 rounded-lg border shadow-sm">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3">Next Steps</h4>
                  <p className="text-sm leading-relaxed">{result.advice}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              {result.severity === 'High' || result.severity === 'Medium' ? (
                <Button className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 shadow-xl" onClick={goToEmergency}>
                  Trigger Emergency Protocol <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-14 text-lg" onClick={() => router.push('/search')}>
                  Book Regular Consultation
                </Button>
              )}
              <Button variant="ghost" onClick={() => setResult(null)}>Analyze Different Symptoms</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
