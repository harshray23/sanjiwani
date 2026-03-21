"use client";

import { AyurvedaRecommendation } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  CheckCircle2, 
  XCircle, 
  Utensils, 
  Sprout, 
  Wind, 
  Flame, 
  Droplets, 
  Activity, 
  Stethoscope,
  ShieldCheck,
  Languages,
  BookOpen
} from "lucide-react";

interface AyurvedaCareProps {
  data: AyurvedaRecommendation;
  diseaseName: string;
}

export function AyurvedaCare({ data, diseaseName }: AyurvedaCareProps) {
  const getDoshaIcon = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return <Wind className="h-4 w-4 text-blue-400" />;
      case 'pitta': return <Flame className="h-4 w-4 text-orange-500" />;
      case 'kapha': return <Droplets className="h-4 w-4 text-cyan-500" />;
      default: return <Activity className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/30 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="bg-green-100/50 border-b border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <CardTitle className="text-xl font-headline text-green-800">AyurGenixAI Supportive Plan</CardTitle>
          </div>
          <Badge className="bg-green-600 hover:bg-green-700">Holistic Care</Badge>
        </div>
        <CardDescription className="text-green-700 font-medium flex items-center gap-2 mt-1">
          <Languages className="h-3 w-3"/> {diseaseName} ({data.hindi_name} / {data.marathi_name})
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        {/* Profile Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 p-4 rounded-xl border border-green-100 shadow-sm">
            <p className="text-[10px] font-bold text-green-800 uppercase mb-2 tracking-widest">Dosha Imbalance</p>
            <div className="flex flex-wrap gap-2">
              {data.doshas.map(d => (
                <Badge key={d} variant="outline" className="flex items-center gap-1.5 border-green-200 bg-white">
                  {getDoshaIcon(d)} {d}
                </Badge>
              ))}
            </div>
          </div>
          <div className="bg-white/60 p-4 rounded-xl border border-green-100 shadow-sm">
            <p className="text-[10px] font-bold text-green-800 uppercase mb-2 tracking-widest">Prakriti Constitution</p>
            <Badge className="bg-accent/10 text-accent border-accent/20">{data.prakriti}</Badge>
          </div>
          <div className="bg-white/60 p-4 rounded-xl border border-green-100 shadow-sm">
            <p className="text-[10px] font-bold text-green-800 uppercase mb-2 tracking-widest">Disease Prognosis</p>
            <span className="text-xs font-semibold text-muted-foreground">{data.prognosis}</span>
          </div>
        </div>

        {/* Herbal & Formulation */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
            <Sprout className="h-4 w-4" /> Recommended Formulation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-between">
              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Standard Dose</p>
              <p className="text-lg font-bold">{data.formulation}</p>
            </div>
            <div className="bg-white/40 p-4 rounded-xl border border-green-100 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-green-800 uppercase mb-2">Key Herbs</p>
              <div className="flex flex-wrap gap-2">
                {data.herbs.map(h => (
                  <Badge key={h} variant="secondary" className="bg-white border-green-200 text-green-700">{h}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dietary Guidance */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
              <Utensils className="h-4 w-4" /> Dietary Recommendations
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Preferred Foods
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {data.diet.eat.map(f => <li key={f} className="flex items-start gap-2"><span>•</span> <span>{f}</span></li>)}
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                <p className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Avoid These
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {data.diet.avoid.map(f => <li key={f} className="flex items-start gap-2"><span>•</span> <span>{f}</span></li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Yoga & Routine */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Yoga & Recovery
            </h4>
            <div className="bg-white p-4 rounded-xl border border-green-100 space-y-4 shadow-sm">
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase mb-2">Yoga Asanas</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.yoga.map(y => <Badge key={y} variant="secondary" className="text-[10px]">{y}</Badge>)}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-green-600 uppercase mb-2">Daily Wellness Routine</p>
                {data.routine.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-green-900">
                    <span className="font-bold text-green-600 shrink-0">{item.time}:</span>
                    <span>{item.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Interventions & Complications */}
        <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-3">
          <div className="flex items-center gap-2 text-orange-800">
            <Stethoscope className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Clinical Context & Complications</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div>
              <p className="font-bold text-orange-700 mb-1 flex items-center gap-1.5"><BookOpen className="h-3 w-3"/> Modern Interventions:</p>
              <p className="text-muted-foreground leading-relaxed">{data.medical_intervention.join(', ')}</p>
            </div>
            <div>
              <p className="font-bold text-orange-700 mb-1 flex items-center gap-1.5"><ShieldCheck className="h-3 w-3"/> Potential Risks:</p>
              <p className="text-muted-foreground leading-relaxed">{data.complications.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pt-4 border-t border-green-100">
          <div className="flex items-center gap-2 text-[10px] text-green-700 font-bold uppercase">
            <ShieldCheck className="h-3 w-3" /> Integrity Audit: Avalanche Anchored
          </div>
          <p className="italic text-[10px] text-muted-foreground text-center max-w-lg">
            Consult a qualified Ayurvedic practitioner or medical doctor before following any recommendation. Prevention focus: {data.prevention}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
