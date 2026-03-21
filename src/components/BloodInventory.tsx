"use client";

import { BloodInventory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";

interface BloodInventoryProps {
  inventory: BloodInventory;
}

export function BloodInventoryDisplay({ inventory }: BloodInventoryProps) {
  const getStatusColor = (units: number) => {
    if (units >= 10) return "text-green-600 dark:text-green-400";
    if (units >= 3) return "text-orange-500 dark:text-orange-400";
    return "text-red-600 dark:text-red-500 font-bold";
  };

  const getStatusBg = (units: number) => {
    if (units >= 10) return "bg-green-500/10";
    if (units >= 3) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {Object.entries(inventory).map(([type, units]) => (
        <div 
          key={type} 
          className={`flex flex-col items-center justify-center p-2 rounded-lg border border-border/50 ${getStatusBg(units)}`}
        >
          <span className="text-xs font-bold mb-1">{type}</span>
          <div className="flex items-center gap-0.5">
            <Droplet className={`h-3 w-3 ${getStatusColor(units)} fill-current`} />
            <span className={`text-sm ${getStatusColor(units)}`}>{units}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
