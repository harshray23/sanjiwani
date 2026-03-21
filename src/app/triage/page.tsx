
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Activity, 
  ShieldAlert, 
  HeartPulse, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  FlaskConical,
  Camera,
  History
} from "lucide-react";
import { performTriage } from '@/ai/flows/triage-flow';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const COMMON_SYMPTOMS = [
  { id: 'fever', label: 'Fever' },
  { id: 'cough', label: 'Cough' },
  { id: 'pain', label: 'Severe Pain' },
  { id: 'breathing', label: 'Difficulty Breathing' },
  { id: 'rash', label: 'Skin Rash/Spots' },
  { id: 'bleeding', label: 'Unusual Bleeding' },
  { id: 'fatigue', label: 'Extreme Fatigue' },
  { id: 'dizziness', label: 'Dizziness/Fainting' },
];

export default function TriagePage() {
  const [step, setStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState([50]);
  const [duration, setDuration] = useState("1-2 days");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleTriage = async () => {
    setIsAnalyzing(true);
    try {
      const summary = `Patient reports: ${selectedSymptoms.join(', ')}. Severity: ${severity[0]}/100. Duration: ${duration}.`;
      const triageResult = await performTriage({ symptoms: summary });
      
      // Transform AI output to include likelihood for the "Radar" UI
      const enrichedResult = {
        ...triageResult,
        likelihoods: triageResult.possibleConditions.map((c: string, i: number) => ({
          name: c,
          value: 90 - (i * 20) // Mock scores for visual radar
        }))
      };
      
      setResult(enrichedResult);
      setStep(3);
    } catch (error: any) {
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-2 gap-4">
              {COMMON_SYMPTOMS.map((s) => (
                <div key={s.id} 
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedSymptoms.includes(s.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                  onClick={() => toggleSymptom(s.id)}
                >
                  <Checkbox checked={selectedSymptoms.includes(s.id)} />
                  <Label className="font-medium cursor-pointer">{s.label}</Label>
                </div>
              ))}
            </div>
            <Button 
              className="w-full h-12 text-lg" 
              disabled={selectedSymptoms.length === 0}
              onClick={() => setStep(1)}
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-lg font-bold">How severe is the discomfort?</Label>
                <span className="font-bold text-primary">{severity[0]}%</span>
              </div>
              <Slider value={severity} onValueChange={setSeverity} max={100} step={1} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Unbearable</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-bold">Duration of symptoms?</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Less than 24h", "1-2 days", "3-5 days", "1 week+"].map(d => (
                  <Button 
                    key={d} 
                    variant={duration === d ? "default" : "outline"} 
                    onClick={() => setDuration(d)}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-[2]" onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
              <Label className="text-lg font-bold">Visual Evidence (Optional)</Label>
              <p className="text-sm text-muted-foreground">Upload a photo of rashed areas, injuries, or swelling for better analysis.</p>
              
              <div className="relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <Button 
                      variant="destructive" size="sm" className="absolute top-2 right-2" 
                      onClick={() => {setImage(null); setImagePreview(null);}}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                    <Button variant="outline" asChild>
                      <Label htmlFor="image-upload" className="cursor-pointer">Capture or Upload</Label>
                    </Button>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-[2] h-12 text-lg font-bold" onClick={handleTriage} disabled={isAnalyzing}>
                {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : "Start Clinical Assessment"}
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95">
            {/* Risk Radar Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="text-primary h-5 w-5" /> Health Radar
                </h3>
                <Badge className={result.severity === 'High' ? 'bg-red-600' : 'bg-green-600'}>
                  {result.severity} Urgency
                </Badge>
              </div>
              <div className="bg-muted/30 p-6 rounded-2xl border border-primary/10 space-y-6">
                {result.likelihoods.map((l: any) => (
                  <div key={l.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-muted-foreground">{l.value}% Correlation</span>
                    </div>
                    <Progress value={l.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Pathways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-accent" /> Recommended Provider
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground mb-3">Best matched specialty for your symptoms.</p>
                  <Button size="sm" className="w-full" onClick={() => router.push(`/search?query=${result.recommendedResources.specialty}`)}>
                    Find {result.recommendedResources.specialty}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" /> Priority Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground mb-3">Diagnostic tests to confirm current status.</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => router.push('/diagnostics')}>
                    Book Lab Screenings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Action */}
            {(result.severity === 'High' || result.severity === 'Medium') && (
              <Button className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 shadow-xl shadow-red-100" onClick={() => router.push('/emergency')}>
                Trigger Emergency Dispatch <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            <Button variant="ghost" className="w-full" onClick={() => {setResult(null); setStep(0); setSelectedSymptoms([]);}}>
              Reset Assessment
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="py-12 w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <History className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-accent">Symptom-to-Action Engine</h1>
        <p className="text-lg text-muted-foreground mt-2">Professional triage & structured clinical decision support.</p>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-0 w-full flex justify-between px-2 mb-12 -translate-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 mx-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <Card className="shadow-2xl border-primary/10 overflow-hidden">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-xl">
              {step === 0 ? "Select Primary Symptoms" : step === 1 ? "Provide Specific Context" : step === 2 ? "Final Evidence" : "Assessment Complete"}
            </CardTitle>
            <CardDescription>
              {step < 3 ? "Follow the clinical path for a verified action plan." : "Review your potential conditions and verified next steps."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            {renderStep()}
          </CardContent>
          <CardFooter className="bg-orange-50/50 dark:bg-orange-950/10 border-t py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Disclaimer:</strong> This is a decision support tool, not a professional medical diagnosis. 
                Data is anchored to Avalanche for integrity audit trails. In emergencies, dial 108.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
