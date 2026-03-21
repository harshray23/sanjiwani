"use client";

import { AyurvedaRecommendation } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Clock, CheckCircle2, XCircle, Utensils, Sprout } from "lucide-react";

interface AyurvedaCareProps {
  data: AyurvedaRecommendation;
}

export function AyurvedaCare({ data }: AyurvedaCareProps) {
  return (
    <Card className="border-green-200 bg-green-50/30 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="bg-green-100/50 border-b border-green-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <CardTitle className="text-xl font-headline text-green-800">Ayurvedic Support Assistant</CardTitle>
          </div>
          <Badge className="bg-green-600 hover:bg-green-700">Supportive Care</Badge>
        </div>
        <CardDescription className="text-green-700 font-medium">
          Traditional lifestyle and dietary recommendations to support your recovery.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        {/* Supportive Remedies */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
            <Sprout className="h-4 w-4" /> Recommended Supportive Remedies
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.remedies.map(r => (
              <Badge key={r} variant="outline" className="border-green-200 bg-white text-green-700 py-1.5 px-3">
                {r}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dietary Guidance */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
              <Utensils className="h-4 w-4" /> Dietary Guidance
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                <p className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Preferred Foods
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {data.diet.eat.map(f => <li key={f}>• {f}</li>)}
                </ul>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                <p className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Avoid These
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {data.diet.avoid.map(f => <li key={f}>• {f}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Daily Routine */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-800 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Your Wellness Routine
            </h4>
            <div className="space-y-2">
              {data.routine.map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-2 hover:bg-white/50 rounded transition-colors">
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded shrink-0 mt-1">
                    {item.time}
                  </span>
                  <p className="text-sm text-green-900">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-white/50 rounded-lg border border-green-100 italic text-[10px] text-green-700 text-center">
          "Ayurveda provides supportive wellness guidance based on traditional principles. It is intended to be used alongside modern medical care."
        </div>
      </CardContent>
    </Card>
  );
}
