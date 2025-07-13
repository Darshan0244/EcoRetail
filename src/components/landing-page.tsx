
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf } from 'lucide-react';
import { Logo } from './logo';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-20">
        <Logo className="text-white" />
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center text-center">
        <section className="relative w-full h-screen flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://img.freepik.com/premium-photo/eco-friendly-packaging-solutions-sustainable-future_1033579-175475.jpg"
              alt="Eco-friendly packaging background"
              layout="fill"
              objectFit="cover"
              data-ai-hint="eco packaging"
              className="brightness-50"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 p-4 text-white max-w-4xl">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Build a Sustainable Future for Retail
            </h1>
            <p className="mt-4 md:mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white/80">
              EcoRetail provides AI-powered tools to help you reduce waste, optimize your supply chain, and make environmentally responsible decisions.
            </p>
            <div className="mt-8 md:mt-10">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">
                  Get Started for Free
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
