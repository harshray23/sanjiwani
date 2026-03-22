
"use client";

import { useEffect, useState } from 'react';
import { getRewards, rewardUser } from '@/lib/data';
import type { RewardActivity, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Coins, Trophy, History, ShieldCheck, Heart, Hospital, FileText, ArrowUpRight, Zap, ExternalLink, Loader2, CheckCircle2, Info, ArrowRight, UserPlus, MapPin, SearchCheck } from "lucide-react";
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function RewardsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [rewards, setRewards] = useState<{ points: number, history: RewardActivity[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const fetchRewards = async (uid: string) => {
    const data = await getRewards(uid);
    setRewards(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(currentUser);

    if (currentUser) {
      fetchRewards(currentUser.uid);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleClaimMockDonation = async () => {
    if (!user) return;
    setIsClaiming(true);
    
    // Simulate Blockchain Latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const txHash = "0x" + Math.random().toString(16).slice(2, 42);
    await rewardUser(user.uid, 'Blood Donation', 50, txHash);
    
    toast({
      title: "Points Credited!",
      description: "50 Sanjeevani Points anchored to Avalanche Fuji.",
    });
    
    await fetchRewards(user.uid);
    setIsClaiming(false);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-8 h-screen">
      <Lottie animationData={loadingAnimation} loop={true} className="w-32 h-32" />
      <p className="mt-4 text-muted-foreground">Loading Your Sanjeevani Points...</p>
    </div>
  );

  if (!user || !rewards) return (
    <div className="text-center p-12 max-w-md mx-auto my-20 bg-card rounded-xl shadow-lg border">
      <Coins className="mx-auto h-16 w-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">Sanjeevani Rewards</h2>
      <p className="text-muted-foreground mb-6">Contribute to the health ecosystem and earn verified rewards on Avalanche.</p>
      <Button asChild className="w-full"><Link href="/login">Go to Login</Link></Button>
    </div>
  );

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'Blood Donation': return <Heart className="text-red-500"/>;
      case 'Hospital Update': return <Hospital className="text-blue-500"/>;
      case 'Record Upload': return <FileText className="text-green-500"/>;
      case 'Payment Proof': return <ShieldCheck className="text-orange-500"/>;
      default: return <ShieldCheck className="text-primary"/>;
    }
  };

  const nextMilestone = rewards.points < 50 ? 50 : (rewards.points < 150 ? 150 : 500);
  const milestoneProgress = Math.min((rewards.points / nextMilestone) * 100, 100);
  const currentBadge = rewards.points < 50 ? "Contributor" : (rewards.points < 150 ? "Health Helper" : "Life Saver");

  return (
    <div className="py-12 w-full max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">
            <Zap className="h-4 w-4 fill-primary"/> Avalanche Fuji Testnet Active
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent">Impact Dashboard</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your contributions to public healthcare integrity are rewarded through decentralized smart contracts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Points Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Coins className="h-48 w-48"/>
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-headline text-primary flex items-center gap-2">
              <Trophy className="h-5 w-5"/> Current Standing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="text-7xl font-bold text-primary">{rewards.points}</span>
              <span className="text-xl font-medium text-muted-foreground">Sanjeevani Points</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-accent px-2 py-0.5 bg-accent/10 rounded border border-accent/20">{currentBadge}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground"/>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Contributor: 0-50 pts</p>
                                <p>Health Helper: 50-150 pts</p>
                                <p>Life Saver: 150+ pts</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <span className="text-muted-foreground font-medium">{rewards.points} / {nextMilestone} to Next Level</span>
              </div>
              <Progress value={milestoneProgress} className="h-4 bg-muted border border-border/50"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-primary/10 shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Wallet Identity</p>
                <p className="text-xs font-mono truncate text-primary/80">{user.walletAddress || '0x82a1...91d'}</p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-primary/10 shadow-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Anchoring Network</p>
                <p className="text-xs font-semibold flex items-center gap-1.5">
                    Avalanche C-Chain <Badge className="bg-green-500 h-2 w-2 p-0 rounded-full animate-pulse"/>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Tasks Card */}
        <Card className="shadow-xl border-accent/20 bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-accent">How to Earn</CardTitle>
            <CardDescription>Select a task to contribute and earn points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            
            {/* Task 1: Blood Donation */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-all cursor-pointer group border border-transparent hover:border-red-100 shadow-sm bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-lg group-hover:scale-110 transition-transform shadow-inner"><Heart className="h-5 w-5 text-red-600"/></div>
                    <div>
                        <p className="text-sm font-bold">Blood Donation</p>
                        <p className="text-[10px] text-muted-foreground">Log a verified donation</p>
                    </div>
                  </div>
                  <Badge className="bg-red-600 font-bold">+50</Badge>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Heart className="text-red-600"/> Log Blood Donation</DialogTitle>
                  <DialogDescription>
                    Did you donate blood at a Sanjeevani partner hospital? Log it here to anchor your contribution to Avalanche.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-5 bg-muted rounded-full shadow-inner">
                    <ShieldCheck className="h-14 w-14 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground px-8 leading-relaxed">
                    By clicking confirm, we will verify your donation record with the hospital and issue a <strong>cryptographic proof</strong> on the Fuji C-Chain.
                  </p>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleClaimMockDonation} disabled={isClaiming} className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-lg">
                    {isClaiming ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                    Confirm Donation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Task 2: Facility Update */}
            <div 
              className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-all cursor-pointer group border border-transparent hover:border-blue-100 shadow-sm bg-muted/30"
              onClick={() => router.push('/hospitals')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform shadow-inner"><Hospital className="h-5 w-5 text-blue-600"/></div>
                <div>
                    <p className="text-sm font-bold">Facility Update</p>
                    <p className="text-[10px] text-muted-foreground">Verify bed availability</p>
                </div>
              </div>
              <Badge className="bg-blue-600 font-bold">+15</Badge>
            </div>

            {/* Task 3: Verified Record */}
            <div 
              className="flex items-center justify-between p-4 rounded-xl hover:bg-green-50 transition-all cursor-pointer group border border-transparent hover:border-green-100 shadow-sm bg-muted/30"
              onClick={() => router.push('/records/upload')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-lg group-hover:scale-110 transition-transform shadow-inner"><FileText className="h-5 w-5 text-green-600"/></div>
                <div>
                    <p className="text-sm font-bold">Verified Record</p>
                    <p className="text-[10px] text-muted-foreground">Upload AI-validated report</p>
                </div>
              </div>
              <Badge className="bg-green-600 font-bold">+10</Badge>
            </div>

          </CardContent>
          <CardFooter>
            <p className="text-[10px] text-center w-full text-muted-foreground italic flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Securely verified by the Sanjeevani Trust Protocol.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* NEW: Contributor Guide Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
          <Info className="h-6 w-6 text-primary"/> Sanjeevani Contributor Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-red-500 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">1. Blood Donation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>Help bridge the gap in emergency blood stock. Visit any partner hospital and donate.</p>
                    <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1 shrink-0"/> Visit a partner facility</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1 shrink-0"/> Log it in the Impact Dashboard</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1 shrink-0"/> Receive 50 points upon verification</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">2. Facility Verification</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>Real-time data saves lives. Check if ICU bed or Oxygen counts are accurate at your local clinic.</p>
                    <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0"/> Go to "Find Hospitals"</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0"/> Click "Verify Availability"</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 shrink-0"/> Receive 15 points per update</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">3. Medical Proofs</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                    <p>Secure your medical history. Upload reports to the Health Vault for AI-validated blockchain anchoring.</p>
                    <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1 shrink-0"/> Upload PDF/Image of report</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1 shrink-0"/> Wait for AI integrity check</li>
                        <li className="flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1 shrink-0"/> Receive 10 points per record</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Activity History */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
          <History className="h-6 w-6"/> Recent Activity
        </h3>
        {rewards.history.length === 0 ? (
          <Card className="p-16 text-center border-dashed bg-muted/10">
            <Coins className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20"/>
            <h4 className="text-lg font-bold mb-1">No Recent Contributions</h4>
            <p className="text-muted-foreground max-w-sm mx-auto">Start contributing to the healthcare network to earn your first Sanjeevani Points.</p>
            <Button asChild variant="outline" className="mt-6">
                <Link href="/hospitals">Browse Hospitals</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rewards.history.map(activity => (
              <Card key={activity.id} className="shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-xl shadow-inner group-hover:bg-primary/10 transition-colors">
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-500"/>
                        {new Date(activity.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary flex items-center gap-1 justify-end">
                        <ArrowUpRight className="h-5 w-5"/> {activity.points}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Points Credited</p>
                    </div>
                    {activity.txHash && (
                      <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild className="hover:bg-accent/10">
                                    <Link href={activity.txHash.startsWith('simulated') ? '#' : `https://testnet.snowtrace.io/tx/${activity.txHash}`} target="_blank">
                                    <ExternalLink className="h-5 w-5 text-accent"/>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Proof on Avalanche</p>
                            </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
