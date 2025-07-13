
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
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import {
  Calculator,
  Leaf,
  Package,
  ShieldCheck,
  Truck,
  Zap,
  Sparkles,
  FileText,
} from 'lucide-react';
import { ReportDialog } from '@/components/report-dialog';
import SupplyChainAI from '@/components/features/supply-chain-ai';
import CarbonDisplay from '@/components/features/carbon-display';
import SourceVerification from '@/components/features/source-verification';
import EnergyAI from '@/components/features/energy-ai';
import PackageGuide from '@/components/features/package-guide';
import ShippingCalc from '@/components/features/shipping-calc';
import AlternativeFinder from '@/components/features/alternative-finder';
import type { FindSustainableAlternativeOutput } from '@/ai/flows/find-sustainable-alternative';


const navItems = [
  { id: 'supply-chain-ai', label: 'Supply Chain AI', icon: Truck, component: SupplyChainAI },
  { id: 'carbon-display', label: 'Carbon Display', icon: Leaf, component: CarbonDisplay },
  { id: 'source-verification', label: 'Source Verification', icon: ShieldCheck, component: SourceVerification },
  { id: 'energy-ai', label: 'Energy Management AI', icon: Zap, component: EnergyAI },
  { id: 'package-guide', label: 'Packaging Guide', icon: Package, component: PackageGuide },
  { id: 'shipping-calc', label: 'Shipping Calculator', icon: Calculator, component: ShippingCalc },
  { id: 'alternative-finder', label: 'Alternative Finder', icon: Sparkles, component: AlternativeFinder },
];

const reportableFeatures = ['supply-chain-ai', 'energy-ai', 'alternative-finder'];

export function Dashboard() {
  const [activeFeature, setActiveFeature] = useState('supply-chain-ai');
  const [reportData, setReportData] = useState<any>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();

  const activeNavItem = useMemo(() => {
    return navItems.find(item => item.id === activeFeature) || navItems[0];
  }, [activeFeature]);

  const handleFeatureChange = (featureId: string) => {
    setActiveFeature(featureId);
    setReportData(null); // Reset report data when changing features
  };

  const activeComponent = useMemo(() => {
    const Component = activeNavItem.component;
    return <Component onResult={setReportData} />;
  }, [activeNavItem]);

  const isReportable = useMemo(() => {
    return reportableFeatures.includes(activeFeature);
  }, [activeFeature]);

  const getReport = () => {
    if (!isReportable) return;

    if (!reportData) {
      toast({
        variant: 'destructive',
        title: 'No Action Performed',
        description: 'Please generate a result on this page before getting a report.',
      });
      return;
    }
    setIsReportDialogOpen(true);
  };
  
  const contentSummary = useMemo(() => {
    if (!reportData) return '';

    // For alternative finder, exclude the large image data from the summary.
    if (activeFeature === 'alternative-finder' && reportData.generatedImage) {
      const { generatedImage, ...rest } = reportData as FindSustainableAlternativeOutput;
      return JSON.stringify(rest);
    }
    
    return JSON.stringify(reportData);
  }, [reportData, activeFeature]);

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
                 <Button onClick={getReport} disabled={!isReportable}>
                    <FileText className="mr-2" />
                    Get Report
                 </Button>
            </header>
            <main className="flex-1 overflow-y-auto bg-background">
              {activeComponent}
            </main>
        </SidebarInset>
      </div>
      {isReportable && (
         <ReportDialog
            isOpen={isReportDialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    // Reset report data when closing the dialog
                    setReportData(null);
                }
                setIsReportDialogOpen(open);
            }}
            featureTitle={activeNavItem.label}
            contentSummary={contentSummary}
        />
      )}
    </SidebarProvider>
  );
}
