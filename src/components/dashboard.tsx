
'use client';
import React, { useState, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  Calculator,
  Leaf,
  Package,
  ShieldCheck,
  Truck,
  Zap,
  Sparkles,
} from 'lucide-react';

import SupplyChainAI from '@/components/features/supply-chain-ai';
import CarbonDisplay from '@/components/features/carbon-display';
import SourceVerification from '@/components/features/source-verification';
import EnergyAI from '@/components/features/energy-ai';
import PackageGuide from '@/components/features/package-guide';
import ShippingCalc from '@/components/features/shipping-calc';
import AlternativeFinder from '@/components/features/alternative-finder';

const navItems = [
  { id: 'supply-chain-ai', label: 'Supply Chain AI', icon: Truck, component: SupplyChainAI },
  { id: 'carbon-display', label: 'Carbon Display', icon: Leaf, component: CarbonDisplay },
  { id: 'source-verification', label: 'Source Verification', icon: ShieldCheck, component: SourceVerification },
  { id: 'energy-ai', label: 'Energy Management AI', icon: Zap, component: EnergyAI },
  { id: 'package-guide', label: 'Packaging Guide', icon: Package, component: PackageGuide },
  { id: 'shipping-calc', label: 'Shipping Calculator', icon: Calculator, component: ShippingCalc },
  { id: 'alternative-finder', label: 'Alternative Finder', icon: Sparkles, component: AlternativeFinder },
];

export function Dashboard() {
  const [activeFeature, setActiveFeature] = useState('supply-chain-ai');

  const activeNavItem = useMemo(() => {
    return navItems.find(item => item.id === activeFeature) || navItems[0];
  }, [activeFeature]);

  const activeComponent = useMemo(() => {
    const Component = activeNavItem.component;
    return <Component />;
  }, [activeNavItem]);

  const handleFeatureChange = (featureId: string) => {
    setActiveFeature(featureId);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleFeatureChange(item.id)}
                    isActive={activeFeature === item.id}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b md:justify-end">
                <SidebarTrigger className="md:hidden" />
            </header>
            <main className="flex-1 overflow-y-auto bg-background">
              {activeComponent}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
