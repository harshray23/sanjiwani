
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Link as LinkIcon, Calendar, Star, Mic, Brain, Zap, Shield, Coins, Activity } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { value: '14', label: 'Verified Doctors', icon: <ShieldCheck className="h-6 w-6 text-accent" />, glow: 'cyan' },
    { value: 'Avalanche', label: 'Trust Layer', icon: <LinkIcon className="h-6 w-6 text-accent" />, glow: 'cyan' },
    { value: '200+', label: 'Appointments Daily', icon: <Calendar className="h-6 w-6 text-orange-500" />, glow: 'orange' },
    { value: '4.8/5', label: 'Patient Rating', icon: <Star className="h-6 w-6 text-yellow-400 fill-current" />, glow: 'orange' },
  ];

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-black">
      {/* Immersive Background Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/h3.jpg" 
          alt="Healthcare Background" 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000">
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight text-white font-headline drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              Your Health Journey <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Powered by AI Trust Layer</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Find trusted doctors and real-time hospital availability verified on the <br/>
              <span className="text-white font-bold border-b border-accent/50 pb-1">Avalanche Blockchain</span>. Quality healthcare, anchored in truth.
            </p>
          </div>

          {/* Glowing Search Bar */}
          <div className="relative group max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <form onSubmit={handleSearch} className="relative glass-morphism neon-glow-cyan rounded-full p-2 flex items-center gap-2">
              <div className="flex-1 flex items-center px-4">
                <div className="p-2 rounded-full bg-accent/10 mr-3">
                    <Brain className="h-6 w-6 text-accent" />
                </div>
                <div className="h-6 w-px bg-white/10 mr-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, hospitals, or symptoms..."
                  className="bg-transparent border-none focus-visible:ring-0 text-white text-lg h-12 placeholder:text-white/40"
                />
              </div>
              <Button type="button" size="icon" variant="ghost" className="rounded-full text-white/50 hover:text-accent">
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="submit" size="icon" className="bg-accent text-black rounded-full h-12 w-12 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.5)]">
                <Search className="h-6 w-6" />
              </Button>
            </form>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-8 animate-in fade-in duration-1000 delay-500">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={cn(
                    "glass-morphism rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 group cursor-default",
                    stat.glow === 'cyan' ? 'neon-glow-cyan' : 'neon-glow-orange'
                )}
              >
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-white/50 font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-12 animate-in fade-in duration-1000 delay-700">
            <Button asChild size="lg" className="btn-gradient-orange rounded-full h-14 px-10 text-xl font-black neon-glow-orange hover:scale-105 transition-transform">
              <Link href="/search">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass-morphism neon-glow-red border-red-500/50 text-white hover:bg-red-500/10 rounded-full h-14 px-10 text-xl font-black transition-transform hover:scale-105">
              <Link href="/emergency">Emergency Verification</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The Avalanche Trust Protocol Section */}
      <section className="relative z-10 py-32 px-4 bg-black/60 backdrop-blur-md overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto space-y-20 relative">
          {/* Section Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 border border-white/10 bg-white/5 text-sm font-bold tracking-widest uppercase text-white split-border-container">
              <span className="text-accent">Verification</span> 
              <span className="text-orange-400">Layer</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white font-headline leading-tight">
              The Avalanche <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">Trust Protocol</span>
            </h2>
            <p className="text-xl text-white/60 font-medium">Securing Healthcare with Blockchain Integrity</p>
          </div>

          {/* Cards Grid with Connection Line */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 relative">
            {/* The Glowing Pulse Line (Desktop only) */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] h-32 items-center justify-center z-0 pointer-events-none">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_rgba(0,242,255,0.8)] opacity-50" />
                <div className="absolute w-full flex justify-center">
                    <svg className="w-full h-16 text-accent opacity-80" viewBox="0 0 200 40">
                        <path d="M0 20 L60 20 L70 5 L80 35 L90 20 L110 20 L120 5 L130 35 L140 20 L200 20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="200" className="animate-draw-pulse" />
                    </svg>
                </div>
                <div className="absolute w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_rgba(0,242,255,1)] animate-ping" />
            </div>

            {/* Card 1: Immutable Verification */}
            <div className="glass-morphism neon-glow-cyan p-10 rounded-[2.5rem] space-y-8 relative z-10 group hover:scale-[1.02] transition-transform duration-500">
              <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,242,255,0.1)] relative">
                <Shield className="h-12 w-12 text-accent" />
                <LinkIcon className="h-6 w-6 text-accent absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-accent/50" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-white">Immutable Verification</h3>
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  When a hospital updates its ICU bed count, a cryptographic hash is anchored to Avalanche. 
                  This ensures that availability data cannot be faked or retroactively changed.
                </p>
              </div>
            </div>

            {/* Card 2: Incentive Rewards */}
            <div className="glass-morphism neon-glow-cyan p-10 rounded-[2.5rem] space-y-8 relative z-10 group hover:scale-[1.02] transition-transform duration-500">
              <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,242,255,0.1)] relative">
                <Coins className="h-12 w-12 text-accent" />
                <Zap className="h-6 w-6 text-orange-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black text-white">Incentive Rewards</h3>
                <p className="text-white/70 text-lg leading-relaxed font-medium">
                  Patients and community contributors who provide real-time updates on facility status or donate blood are rewarded with Sanjeevani Points, powered by Avalanche smart contracts.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="text-center pt-8">
            <Button variant="outline" className="rounded-full border-none split-border h-16 px-12 text-xl font-black text-white transition-all hover:scale-105">
              Explore Trust Layer
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Star/Flare in corner */}
      <div className="fixed bottom-8 right-8 z-20 pointer-events-none opacity-40">
        <Zap className="h-12 w-12 text-white fill-white animate-pulse" />
      </div>

      <style jsx global>{`
        @keyframes draw-pulse {
          to {
            stroke-dashoffset: -400;
          }
        }
        .animate-draw-pulse {
          stroke-dashoffset: 0;
          animation: draw-pulse 4s linear infinite;
        }
        .split-border {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        .split-border::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: inherit;
          background: linear-gradient(to right, #00f2ff, #ff8c00);
          -webkit-mask: 
             linear-gradient(#fff 0 0) content-box, 
             linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
