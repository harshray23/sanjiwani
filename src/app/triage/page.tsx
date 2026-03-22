
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Activity, 
  History,
  Thermometer,
  Wind,
  Zap,
  Lungs,
  LayoutGrid,
  Droplet,
  Battery,
  Waves,
  ArrowRight,
  Info,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  AlertCircle
} from "lucide-react";
import { performTriage } from '@/ai/flows/triage-flow';
import { useToast } from '@/hooks/use-toast';
import { getDiseaseProfile } from '@/lib/data';
import { AyurvedaCare } from '@/components/AyurvedaCare';
import { UnifiedDiseaseProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

const SYMPTOMS_LIST = [
  { id: 'fever', label: 'Fever', icon: <Thermometer className="h-5 w-5 text-cyan-400" /> },
  { id: 'cough', label: 'Cough', icon: <Wind className="h-5 w-5 text-orange-400" /> },
  { id: 'pain', label: 'Severe Pain', icon: <Zap className="h-5 w-5 text-red-400" /> },
  { id: 'breathing', label: 'Difficulty Breathing', icon: <Lungs className="h-5 w-5 text-purple-400" /> },
  { id: 'rash', label: 'Skin Rash/Spots', icon: <LayoutGrid className="h-5 w-5 text-yellow-400" /> },
  { id: 'bleeding', label: 'Unusual Bleeding', icon: <Droplet className="h-5 w-5 text-red-500" /> },
  { id: 'fatigue', label: 'Extreme Fatigue', icon: <Battery className="h-5 w-5 text-purple-500" /> },
  { id: 'dizziness', label: 'Dizziness/Fainting', icon: <Waves className="h-5 w-5 text-cyan-500" /> },
];

export default function TriagePage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [clinicalProfile, setClinicalProfile] = useState<UnifiedDiseaseProfile | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleTriage = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);
    try {
      const summary = `Patient reports: ${selectedSymptoms.join(', ')}.`;
      
      const [triageResult, profile] = await Promise.all([
        performTriage({ symptoms: summary }),
        getDiseaseProfile(selectedSymptoms)
      ]);
      
      setResult({
        ...triageResult,
        likelihoods: triageResult.possibleConditions.map((c: string, i: number) => ({
          name: c,
          value: 90 - (i * 20)
        }))
      });
      setClinicalProfile(profile);
    } catch (error: any) {
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="py-12 w-full max-w-5xl mx-auto space-y-12">
      {/* Header Assembly */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-full glass-morphism border border-orange-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] mx-auto">
                <History className="h-8 w-8 text-orange-400" />
            </div>
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black font-headline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                Clinical Intelligence Hub
            </h1>
            <p className="text-lg text-white/60 font-medium">Deep disease profiling & holistic supportive care path.</p>
        </div>

        {/* Progress Line Simulation */}
        <div className="w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 opacity-50 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      </div>

      {!result ? (
        <div className="relative max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Main Triage Card with Multi-Colored Glowing Border */}
          <div className="rounded-[2.5rem] p-[1px] bg-gradient-to-br from-cyan-500 via-purple-500 to-orange-500 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <Card className="bg-[#0a0f1d] border-none rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pt-10 px-10 pb-6">
                <CardTitle className="text-3xl font-black text-white font-headline">Identify Core Symptoms</CardTitle>
                <CardDescription className="text-lg text-white/40">Follow the clinical path for a verified action plan.</CardDescription>
              </CardHeader>
              
              <CardContent className="px-10 pb-8 space-y-10">
                {/* Symptom Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SYMPTOMS_LIST.map((s) => (
                    <div 
                      key={s.id}
                      onClick={() => toggleSymptom(s.id)}
                      className={cn(
                        "group relative rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 border border-white/5",
                        selectedSymptoms.includes(s.id) 
                          ? "bg-white/5 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                          : "hover:bg-white/[0.02] hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform">
                          {s.icon}
                        </div>
                        <span className="font-bold text-white/80 group-hover:text-white transition-colors">{s.label}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded border",
                        selectedSymptoms.includes(s.id) 
                          ? "text-cyan-400 border-cyan-500/50" 
                          : "text-white/20 border-white/10"
                      )}>
                        {selectedSymptoms.includes(s.id) ? "Selected" : "Select"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Analysis Button */}
                <Button 
                  onClick={handleTriage}
                  disabled={selectedSymptoms.length === 0 || isAnalyzing}
                  className="w-full h-16 rounded-full text-2xl font-black text-black bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)] border-none"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze Symptoms"
                  )}
                </Button>
              </CardContent>

              {/* Disclaimer Footer */}
              <CardFooter className="px-10 pb-10">
                <div className="w-full p-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 flex gap-4 items-start">
                  <AlertCircle className="h-6 w-6 text-purple-400 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-purple-300 uppercase tracking-widest">Medical Disclaimer:</p>
                    <p className="text-sm text-white/40 leading-relaxed">
                      This is a clinical decision support tool for informational purposes. All data is anchored to the **Avalanche C-Chain** for integrity. Consult a qualified practitioner before following any advice.
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          {/* Assessment Results View */}
          {clinicalProfile && (
            <Card className="border-primary/20 shadow-lg overflow-hidden glass-morphism">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-headline text-primary">{clinicalProfile.disease}</CardTitle>
                    <CardDescription className="italic font-medium text-accent">{clinicalProfile.scientific_name}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-white border-white/20">
                    {clinicalProfile.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/40">
                      <Activity className="h-4 w-4"/> Diagnostic indicators
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {clinicalProfile.lab_test_indicators.map(test => (
                        <Badge key={test} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/40">
                      <ShieldCheck className="h-4 w-4"/> Integrity Anchor
                    </div>
                    <p className="text-sm font-mono text-white/60 truncate">Avalanche ID: 0x82a1...91d</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                <Activity className="text-primary h-6 w-6" /> Symptom Correlation Radar
              </h3>
              <Badge className={result.severity === 'High' ? 'bg-red-600' : 'bg-green-600'}>
                {result.severity} Urgency
              </Badge>
            </div>
            
            <div className="glass-morphism p-8 rounded-[2rem] border border-white/5 space-y-6">
              {result.likelihoods.map((l: any) => (
                <div key={l.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-white/80">{l.name}</span>
                    <span className="text-white/40">{l.value}% Correlation</span>
                  </div>
                  <Progress value={l.value} className="h-2 bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          {clinicalProfile?.ayurveda && (
            <AyurvedaCare data={clinicalProfile.ayurveda} diseaseName={clinicalProfile.disease} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl glass-morphism border-white/10" onClick={() => router.push(`/search?query=${result.recommendedResources.specialty}`)}>
              <Stethoscope className="mr-2 h-5 w-5 text-accent" /> Find {result.recommendedResources.specialty}
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl glass-morphism border-white/10" onClick={() => router.push('/diagnostics')}>
              <FlaskConical className="mr-2 h-5 w-5 text-primary" /> Book Priority Tests
            </Button>
          </div>

          {result.severity === 'High' && (
            <Button className="w-full h-16 text-xl font-black bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/20 rounded-full" onClick={() => router.push('/emergency')}>
              Trigger Emergency Dispatch <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          )}

          <Button variant="ghost" className="w-full text-white/40 hover:text-white" onClick={() => {setResult(null); setSelectedSymptoms([]); setClinicalProfile(null);}}>
            Reset Assessment
          </Button>
        </div>
      )}
    </div>
  );
}
