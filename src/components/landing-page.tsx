
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Truck, Zap, Package, ShieldCheck, Calculator, Sparkles } from 'lucide-react';
import { Logo } from './logo';

const features = [
    { icon: Truck, title: 'Supply Chain AI', description: 'Optimize inventory to minimize waste and reduce transport emissions.' },
    { icon: Leaf, title: 'Carbon Display', description: 'Visually show the carbon footprint of products for informed decisions.' },
    { icon: ShieldCheck, title: 'Source Verification', description: 'Verify supplier claims using transparent ledger technology.' },
    { icon: Zap, title: 'Energy Management AI', description: 'Optimize in-store energy consumption to reduce costs and impact.' },
    { icon: Package, title: 'Packaging Guide', description: 'Suggests sustainable packaging options based on product needs.' },
    { icon: Sparkles, title: 'Alternative Finder', description: 'Discover eco-friendly alternatives to conventional products.' },
];

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Fixed Background */}
        <div className="fixed inset-0 z-0">
             <Image
              src="https://img.freepik.com/premium-photo/eco-friendly-packaging-solutions-sustainable-future_1033579-175475.jpg"
              alt="Eco-friendly packaging background"
              layout="fill"
              objectFit="cover"
              data-ai-hint="eco packaging"
              className="brightness-75"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-20">
            <Logo className="text-white" />
        </header>

        <main className="flex-1 flex flex-col z-10">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center text-center text-white">
                <div className="relative p-4 max-w-4xl">
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
            
            {/* Features Section */}
            <section className="bg-background py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                         <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Powerful Tools for a Greener Business</h2>
                         <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">From smart inventory management to transparent sourcing, EcoRetail gives you the insights you need to build a truly sustainable operation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-card p-6 rounded-lg shadow-sm text-center">
                                <div className="flex justify-center items-center mb-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
        <footer className="relative z-10 bg-background/95 backdrop-blur-sm py-6 border-t">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} EcoRetail. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
  );
}
