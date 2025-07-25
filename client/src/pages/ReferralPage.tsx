import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowRight, 
  Copy, 
  Gift, 
  Share2, 
  Users, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function ReferralPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const { t } = useTranslation();
  
  // Fetch referral stats
  const { data: referralStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/referrals/stats"],
    enabled: !!user,
  });

  // Fetch user credits
  const { data: userCredits, isLoading: creditsLoading } = useQuery({
    queryKey: ["/api/referrals/credits"],
    enabled: !!user,
  });

  // Fetch referral code and link
  const { data: referralData, isLoading: codeLoading } = useQuery({
    queryKey: ["/api/referrals/code"],
    enabled: !!user,
  });

  useEffect(() => {
    if (referralData && typeof referralData === 'object' && 'referralLink' in referralData) {
      setReferralLink(referralData.referralLink as string);
    }
  }, [referralData]);
  
  // Referral rewards explanation - aligned with current pricing
  const referralRewards = [
    { type: "1 Friend Signs Up", reward: "2 Free CV Analyses (R10 value)" },
    { type: "3 Friends Sign Up", reward: "Free Essential Pack (R25 value)" },
    { type: "5 Friends Sign Up", reward: "1-Month Professional Plan (R50 value)" },
    { type: "2 Premium Conversions", reward: "Bonus Professional Month (R50 value)" },
    { type: "10 Friends Sign Up", reward: "20% Annual Discount (R100 savings)" }
  ];

  const displayStats = (referralStats && typeof referralStats === 'object') ? {
    invited: (referralStats as any).invited || 0,
    registered: (referralStats as any).registered || 0,
    premiumConversions: (referralStats as any).premiumConversions || 0,
    freeAnalysisEarned: (referralStats as any).freeAnalysisEarned || 0,
  } : {
    invited: 0,
    registered: 0,
    premiumConversions: 0,
    freeAnalysisEarned: 0,
  };

  const displayCredits = (userCredits && typeof userCredits === 'object') ? {
    freeAnalysisCredits: (userCredits as any).freeAnalysisCredits || 0,
    scanCredits: (userCredits as any).scanCredits || 0,
    premiumMonths: (userCredits as any).premiumMonths || 0,
  } : {
    freeAnalysisCredits: 0,
    scanCredits: 0,
    premiumMonths: 0,
  };
  
  // Copy referral link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Referral Link Copied!",
      description: "The link has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Share via various platforms 
  const shareVia = (platform: string) => {
    let shareUrl = "";
    const shareText = "Boost your chances of landing your dream job in South Africa! Use Hire Mzansi to optimize your CV and stand out to employers. Use my referral link:";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + " " + referralLink)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent("Optimize Your CV with Hire Mzansi")}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("Optimize Your CV for South African Job Market")}&body=${encodeURIComponent(shareText + "\n\n" + referralLink)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Refer Friends & Earn CV Credits | Hire Mzansi Referral Program</title>
        <meta 
          name="description" 
          content="Refer friends to Hire Mzansi and earn valuable CV analysis credits. Help your network improve their CVs while earning rewards for professional development." 
        />
        <meta 
          name="keywords" 
          content="CV analysis credits, resume optimization rewards, Hire Mzansi referral, South African CV tool, job application referral" 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('referral.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Help your network improve their job applications and earn valuable rewards. Refer friends and unlock progressive benefits from free CV analysis credits to premium plan access.
          </p>
        </div>
        
        {!user && (
          <Alert className="mb-8 border-primary/50 bg-primary/10">
            <Gift className="h-5 w-5 text-primary" />
            <AlertTitle>{t('common.signInToStart')}</AlertTitle>
            <AlertDescription>
              {t('referral.createAccountDescription')}
              <div className="mt-2">
                <Link href="/auth">
                  <Button variant="default" size="sm" className="mr-2">
                    {t('common.createAccount')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Referral Link Card - Only show for authenticated users */}
        {user && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                {t('referral.yourReferralLink')}
              </CardTitle>
              <CardDescription>
                {t('referral.shareLink')}
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="font-mono text-sm flex-1"
              />
              <Button 
                onClick={copyToClipboard} 
                variant="secondary" 
                className="sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t('referral.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {t('referral.copyLink')}
                  </>
                )}
              </Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Share via</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareVia("facebook")}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareVia("twitter")}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareVia("linkedin")}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareVia("email")}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}
        
        {/* Referral Stats - Only show for authenticated users */}
        {user && (
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Referral Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Your Referral Stats
              </CardTitle>
              <CardDescription>
                Track how many people you've referred and your earned rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-4 bg-muted rounded-lg text-center">
                      <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{displayStats.invited}</p>
                    <p className="text-sm text-muted-foreground">People Invited</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{displayStats.registered}</p>
                    <p className="text-sm text-muted-foreground">Signed Up</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{displayStats.premiumConversions}</p>
                    <p className="text-sm text-muted-foreground">Premium Users</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{displayCredits.freeAnalysisCredits}</p>
                    <p className="text-sm text-muted-foreground">Free Credits Earned</p>
                  </div>
                </div>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard">
                  View Detailed History
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Reward Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Reward Structure
              </CardTitle>
              <CardDescription>
                Earn rewards based on how your referrals use Hire Mzansi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referral Type</TableHead>
                    <TableHead className="text-right">Your Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralRewards.map((reward, index) => (
                    <TableRow key={index}>
                      <TableCell>{reward.type}</TableCell>
                      <TableCell className="text-right font-medium">{reward.reward}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p>
                  <span className="font-medium">How it works:</span> Earn rewards as your friends sign up and use our services. Each milestone unlocks valuable CV optimization benefits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        )}
        
        {/* Call to Action - Only show for authenticated users */}
        {user && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Start Earning CV Analysis Credits</h2>
          <p className="mb-4 max-w-2xl mx-auto">
            Share your referral link and earn valuable rewards. From free CV analysis credits to premium plan access—help your network while advancing your career.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700">
              <Copy className="mr-2 h-4 w-4" />
              Copy Referral Link
            </Button>
            <Button variant="outline" asChild>
              <Link href="/job-sites">
                Job Board
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        )}
        
        {/* FAQ Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold mb-2">How do I earn CV analysis credits?</h3>
              <p className="text-muted-foreground">
                Share your unique referral link with friends. As they sign up and use our services, you'll automatically receive credits and rewards based on our progressive reward structure.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold mb-2">What can I do with earned credits?</h3>
              <p className="text-muted-foreground">
                Credits can be used for CV analysis services, including professional feedback with South African context, industry-specific keyword recommendations, B-BBEE optimization, and personalized improvement tips.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-bold mb-2">Is there a limit to how many rewards I can earn?</h3>
              <p className="text-muted-foreground">
                No limit! You can earn unlimited rewards. Each friend who signs up earns you credits, and premium conversions unlock even more valuable benefits including free monthly access.
              </p>
            </div>
          </div>
        </div>
        
        {/* Second Call to Action */}
        <Card className="mb-10 bg-secondary text-white">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Earn Progressive Rewards Through Referrals
              </h3>
              <p className="mb-4 max-w-2xl mx-auto">
                Your network needs quality CV feedback to succeed in South Africa's job market.
                Share Hire Mzansi and earn valuable credits and premium access while helping others.
              </p>
              <Button variant="default" className="bg-white text-secondary hover:bg-white/90" asChild>
                <Link href="/dashboard">
                  View Your Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Testimonials */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "I referred 3 friends from my university and got the free Deep Analysis. It completely 
                  transformed my CV with South African-specific keywords, and I landed two interviews the following week!"
                </p>
                <p className="font-semibold">Thembi M.</p>
                <p className="text-sm text-muted-foreground">Cape Town</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "After referring 3 friends, I used my free Deep Analysis on my CV. The detailed feedback on 
                  B-BBEE and NQF presentation helped me tailor my application to South African companies perfectly."
                </p>
                <p className="font-semibold">James T.</p>
                <p className="text-sm text-muted-foreground">Johannesburg</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">
                  "As a career coach, I recommend Hire Mzansi to all my clients. The referral program 
                  has been an unexpected bonus for helping people land jobs in SA's competitive market."
                </p>
                <p className="font-semibold">Lesedi K.</p>
                <p className="text-sm text-muted-foreground">Durban</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Third Call to Action */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Start Sharing & Earning Today
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Help your network overcome South Africa's 32% unemployment crisis.
            Share Hire Mzansi with friends and earn rewards together.
          </p>
          
          
        </div>
      </div>
    </>
  );
}