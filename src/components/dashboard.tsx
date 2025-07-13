
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
} from 'lucide-react';

import SupplyChainAI from '@/components/features/supply-chain-ai';
import CarbonDisplay from '@/components/features/carbon-display';
import SourceVerification from '@/components/features/source-verification';
import EnergyAI from '@/components/features/energy-ai';
import PackageGuide from '@/components/features/package-guide';
import ShippingCalc from '@/components/features/shipping-calc';
import { handleGenerateReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { id: 'supply-chain-ai', label: 'Supply Chain AI', icon: Truck, component: <SupplyChainAI /> },
  { id: 'carbon-display', label: 'Carbon Display', icon: Leaf, component: <CarbonDisplay /> },
  { id: 'source-verification', label: 'Source Verification', icon: ShieldCheck, component: <SourceVerification /> },
  { id: 'energy-ai', label: 'Energy Management AI', icon: Zap, component: <EnergyAI /> },
  { id: 'package-guide', label: 'Packaging Guide', icon: Package, component: <PackageGuide /> },
  { id: 'shipping-calc', label: 'Shipping Calculator', icon: Calculator, component: <ShippingCalc /> },
];

export function Dashboard() {
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState('supply-chain-ai');
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportData, setReportData] = useState<{ title: string; content: string } | null>(null);
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
  
    const contentSummary = featureContentRef.current?.innerText || 'No content available.';
  
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
        content: data.report,
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
          content={reportData.content}
        />
      )}
    </SidebarProvider>
  );
}
