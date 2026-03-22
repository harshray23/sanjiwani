
"use client";

import { useEffect, useState } from 'react';
import { getRewards, rewardUser } from '@/lib/data';
import type { RewardActivity, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Coins, Trophy, History, ShieldCheck, Heart, Hospital, FileText, ArrowUpRight, Zap, ExternalLink, Loader2, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animations/Loading_Screen.json';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";

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
    <div className="py-12 w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-accent mb-2">Impact Dashboard</h1>
        <p className="text-muted-foreground">Your contributions to public healthcare integrity, rewarded transparently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Points Card */}
        <Card className="md:col-span-2 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Coins className="h-32 w-32"/>
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-headline text-primary flex items-center gap-2">
              <Trophy className="h-5 w-5"/> Current Standing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-primary">{rewards.points}</span>
              <span className="text-xl font-medium text-muted-foreground">Sanjeevani Points</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Badge: {currentBadge}</span>
                <span className="text-muted-foreground">{rewards.points} / {nextMilestone} to Next Level</span>
              </div>
              <Progress value={milestoneProgress} className="h-3"/>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-background/50 p-4 rounded-lg border border-primary/10">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Wallet Address</p>
                <p className="text-xs font-mono truncate">{user.walletAddress || '0x...82a1...91d'}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-lg border border-primary/10">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Trust Network</p>
                <p className="text-xs font-semibold flex items-center gap-1">Avalanche Fuji <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500"/></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Values Card */}
        <Card className="shadow-lg border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline">How to Earn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            
            {/* Option 1: Blood Donation (Trigger Dialog) */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer group border border-transparent hover:border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full group-hover:scale-110 transition-transform"><Heart className="h-4 w-4 text-red-600"/></div>
                    <span className="text-sm font-medium">Blood Donation</span>
                  </div>
                  <span className="text-primary font-bold">+50</span>
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
                  <div className="p-4 bg-muted rounded-full">
                    <ShieldCheck className="h-12 w-12 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground px-8">
                    By clicking confirm, we will verify your donation record with the hospital and issue a cryptographic proof on the Fuji C-Chain.
                  </p>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleClaimMockDonation} disabled={isClaiming} className="flex-1 bg-red-600 hover:bg-red-700">
                    {isClaiming ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                    Confirm Donation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Option 2: Facility Update (Redirect to Hospitals) */}
            <div 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group border border-transparent hover:border-blue-100"
              onClick={() => router.push('/hospitals')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full group-hover:scale-110 transition-transform"><Hospital className="h-4 w-4 text-blue-600"/></div>
                <span className="text-sm font-medium">Facility Update</span>
              </div>
              <span className="text-primary font-bold">+15</span>
            </div>

            {/* Option 3: Verified Record (Redirect to Upload) */}
            <div 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group border border-transparent hover:border-green-100"
              onClick={() => router.push('/records/upload')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full group-hover:scale-110 transition-transform"><FileText className="h-4 w-4 text-green-600"/></div>
                <span className="text-sm font-medium">Verified Record</span>
              </div>
              <span className="text-primary font-bold">+10</span>
            </div>

          </CardContent>
          <CardFooter>
            <p className="text-[10px] text-center w-full text-muted-foreground italic">
              All rewards are verified by the Sanjeevani Trust Protocol.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Activity History */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold font-headline text-accent flex items-center gap-2">
          <History className="h-6 w-6"/> Recent Activity
        </h3>
        {rewards.history.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20"/>
            <p className="text-muted-foreground">No recent reward activity found. Start contributing to earn points!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rewards.history.map(activity => (
              <Card key={activity.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-full">
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <p className="font-bold">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary flex items-center gap-1 justify-end">
                        <ArrowUpRight className="h-4 w-4"/> {activity.points}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Points Credited</p>
                    </div>
                    {activity.txHash && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={activity.txHash.startsWith('simulated') ? '#' : `https://testnet.snowtrace.io/tx/${activity.txHash}`} target="_blank">
                          <ExternalLink className="h-4 w-4"/>
                        </Link>
                      </Button>
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
