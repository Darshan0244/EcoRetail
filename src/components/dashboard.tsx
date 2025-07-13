
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
import { Button } from '@/components/ui/button';
import { ReportDialog } from '@/components/report-dialog';
import {
  Calculator,
  Leaf,
  Package,
  ShieldCheck,
  Truck,
  Zap,
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
import type { OptimizeInventoryLevelsOutput } from '@/ai/flows/optimize-inventory';
import type { OptimizeEnergyConsumptionOutput } from '@/ai/flows/optimize-energy-consumption';
import type { FindSustainableAlternativeOutput } from '@/ai/flows/find-sustainable-alternative';
import { useToast } from '@/hooks/use-toast';

type ReportableResult = OptimizeInventoryLevelsOutput | OptimizeEnergyConsumptionOutput | FindSustainableAlternativeOutput;

const navItems = [
  { id: 'supply-chain-ai', label: 'Supply Chain AI', icon: Truck, component: SupplyChainAI, reportable: true },
  { id: 'carbon-display', label: 'Carbon Display', icon: Leaf, component: CarbonDisplay, reportable: false },
  { id: 'source-verification', label: 'Source Verification', icon: ShieldCheck, component: SourceVerification, reportable: false },
  { id: 'energy-ai', label: 'Energy Management AI', icon: Zap, component: EnergyAI, reportable: true },
  { id: 'package-guide', label: 'Packaging Guide', icon: Package, component: PackageGuide, reportable: false },
  { id: 'shipping-calc', label: 'Shipping Calculator', icon: Calculator, component: ShippingCalc, reportable: false },
  { id: 'alternative-finder', label: 'Alternative Finder', icon: Sparkles, component: AlternativeFinder, reportable: true },
];

interface ReportData extends GenerateReportOutput {
  title: string;
}

export function Dashboard() {
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState('supply-chain-ai');
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [lastResult, setLastResult] = useState<ReportableResult | null>(null);

  const activeNavItem = useMemo(() => {
    return navItems.find(item => item.id === activeFeature) || navItems[0];
  }, [activeFeature]);

  const activeComponent = useMemo(() => {
    const Component = activeNavItem.component;
    return <Component onResult={activeNavItem.reportable ? setLastResult : undefined} />;
  }, [activeFeature, activeNavItem]);

  const getReport = async () => {
    if (!lastResult) {
      toast({
        variant: 'destructive',
        title: 'No Data to Report',
        description: 'Please generate a result on the page before requesting a report.',
      });
      return;
    }

    setIsReportLoading(true);
    setReportData(null);
  
    const contentSummary = JSON.stringify(lastResult, null, 2);
  
    const { data, error } = await handleGenerateReport({
      featureTitle: activeNavItem.label,
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
        title: `${activeNavItem.label} Report`,
        report: data.report,
        audioDataUri: data.audioDataUri,
      });
    }
  };

  const handleFeatureChange = (featureId: string) => {
    setActiveFeature(featureId);
    setLastResult(null); // Reset last result when changing features
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
                <Button 
                  variant="outline" 
                  onClick={getReport} 
                  disabled={isReportLoading || !activeNavItem.reportable}
                  title={!activeNavItem.reportable ? 'Reports are not available for this feature.' : 'Generate a report'}
                >
                  {isReportLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Report
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto bg-background">
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
