
"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Leaf, Zap, BarChart, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const getStartedLink = user ? "/start" : "/login";

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const AuthNav = () => {
    if (loading) {
      return (
        <Button variant="ghost" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      );
    }

    if (user) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </>
      );
    }

    return (
      <Button variant="ghost" asChild>
        <Link href="/login">Log In</Link>
      </Button>
    );
  };

  const GetStartedButton = ({ isPrimary = false, isLg = false }) => {
    if (loading) {
      return (
        <Button size={isLg ? "lg" : "default"} disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      );
    }
    return (
      <Button size={isLg ? "lg" : "default"} asChild variant={isPrimary ? "default" : "ghost"}>
        <Link href={getStartedLink}>{isPrimary ? "Start Tracking Now" : "Get Started"}</Link>
      </Button>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <AuthNav />
          <GetStartedButton />
        </nav>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight mb-4">
            Unlock the Value of Your Green Initiatives.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Carbon Coin helps you quantify, track, and report your carbon savings from agricultural and technological interventions, turning sustainability efforts into measurable impact.
          </p>
          <GetStartedButton isPrimary isLg />
        </section>

        <section className="bg-card py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">A Comprehensive Toolkit for Carbon Management</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Everything you need to manage your carbon footprint and showcase your positive impact.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Leaf className="h-8 w-8 text-primary" />}
                title="AgriCarbon Wizard"
                description="Easily input data about your land use, soil type, and farming practices to calculate carbon sequestration."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Interventions Tracking"
                description="Log your sustainable interventions like solar panels, EVs, and drip irrigation with type-specific calculators."
              />
              <FeatureCard
                icon={<BarChart className="h-8 w-8 text-primary" />}
                title="Interactive Dashboard"
                description="Visualize your total CO₂e savings and see detailed breakdowns by category and intervention."
              />
              <FeatureCard
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Impact Reporting"
                description="Generate professional PDF reports of your carbon savings data to share with stakeholders."
              />
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <Image src="https://placehold.co/600x400.png" alt="Sustainable agriculture" width={600} height={400} className="rounded-lg shadow-lg" data-ai-hint="sustainable agriculture" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">From Soil to Solar, Every Bit Counts</h2>
                    <p className="text-muted-foreground mt-4 text-lg">
                        Our platform provides specialized wizards to ensure accurate data entry for both agricultural and technological carbon reduction efforts. We empower you to capture the full scope of your environmental contributions.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-4 text-lg" asChild>
                        <Link href="/dashboard">Learn More &rarr;</Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
      <footer className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Carbon Coin. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="text-center p-4">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-headline font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
