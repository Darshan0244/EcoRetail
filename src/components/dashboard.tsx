
'use client';
import React, { useState, useMemo, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/report-dialog';
import {
  Calculator,
  Leaf,
  Package,
  ShieldCheck,
  Truck,
  Zap,
  PanelLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';

import SupplyChainAI from '@/components/features/supply-chain-ai';
import CarbonDisplay from '@/components/features/carbon-display';
import SourceVerification from '@/components/features/source-verification';
import EnergyAI from '@/components/features/energy-ai';
import PackageGuide from '@/components/features/package-guide';
import ShippingCalc from '@/components/features/shipping-calc';
import AlternativeFinder from '@/components/features/alternative-finder';

import { handleGenerateReport } from '@/app/actions';
import type { GenerateReportOutput } from '@/ai/flows/generate-report';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { id: 'supply-chain-ai', label: 'Supply Chain AI', icon: Truck, component: <SupplyChainAI />, description: 'This feature uses AI to predict and optimize inventory levels to minimize waste and reduce carbon emissions from transportation.' },
  { id: 'carbon-display', label: 'Carbon Display', icon: Leaf, component: <CarbonDisplay />, description: 'This feature provides an interactive visual display to understand the carbon footprint of various products, helping users make informed, sustainable decisions.' },
  { id: 'source-verification', label: 'Source Verification', icon: ShieldCheck, component: <SourceVerification />, description: 'This feature allows users to verify the ethical and environmental claims of suppliers using a transparent ledger, tracing a product\'s journey from source to store.' },
  { id: 'energy-ai', label: 'Energy Management AI', icon: Zap, component: <EnergyAI />, description: 'This feature uses AI to analyze store data and provide recommendations for optimizing energy consumption, reducing both costs and environmental impact.' },
  { id: 'package-guide', label: 'Packaging Guide', icon: Package, component: <PackageGuide />, description: 'This feature helps users find the perfect sustainable packaging for their products based on needs like product type, volume, and shipping distance.' },
  { id: 'shipping-calc', label: 'Shipping Calculator', icon: Calculator, component: <ShippingCalc />, description: 'This feature calculates and allows for the offsetting of carbon emissions from shipments, promoting carbon-neutral shipping.' },
  { id: 'alternative-finder', label: 'Alternative Finder', icon: Sparkles, component: <AlternativeFinder />, description: 'This feature uses AI to suggest more eco-friendly alternatives to common products, complete with a justification and a generated image.' },
];

interface ReportData extends GenerateReportOutput {
  title: string;
}

export function Dashboard() {
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState('supply-chain-ai');
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const featureContentRef = useRef<HTMLDivElement>(null);

  const activeComponent = useMemo(() => {
    return navItems.find(item => item.id === activeFeature)?.component || <SupplyChainAI />;
  }, [activeFeature]);

  const activeFeatureLabel = useMemo(() => {
    return navItems.find(item => item.id === activeFeature)?.label || 'Dashboard';
  }, [activeFeature]);
  
  const getReport = async () => {
    setIsReportLoading(true);
    setReportData(null);
  
    const activeNavItem = navItems.find(item => item.id === activeFeature);
    // Prioritize the innerText if it's meaningful, otherwise use the feature's general description.
    const pageContent = featureContentRef.current?.innerText;
    const contentSummary = (pageContent && pageContent.length > 200) 
      ? pageContent 
      : activeNavItem?.description || 'No content available.';
  
    const { data, error } = await handleGenerateReport({
      featureTitle: activeFeatureLabel,
      contentSummary: contentSummary,
    });
  
    setIsReportLoading(false);
  
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error generating report',
        description: error,
      });
    } else if (data) {
      setReportData({
        title: `${activeFeatureLabel} Report`,
        report: data.report,
        audioDataUri: data.audioDataUri,
      });
    }
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
                    onClick={() => setActiveFeature(item.id)}
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
                <Button variant="outline" onClick={getReport} disabled={isReportLoading}>
                  {isReportLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Report
                </Button>
            </header>
            <main ref={featureContentRef} className="flex-1 overflow-y-auto bg-background">
              {activeComponent}
            </main>
        </SidebarInset>
      </div>
      {reportData && (
        <ReportDialog
          open={!!reportData}
          onOpenChange={(isOpen) => !isOpen && setReportData(null)}
          title={reportData.title}
          content={reportData.report}
          audioDataUri={reportData.audioDataUri}
        />
      )}
    </SidebarProvider>
  );
}
