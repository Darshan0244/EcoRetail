
'use client';

import React, { useState } from 'react';
import { FeaturePage } from '@/components/feature-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ShieldCheck, Search, CheckCircle, Tractor, Warehouse, ShoppingCart } from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

const mockChainData: VerificationStep[] = [
  { id: '1', title: 'Farmed & Harvested', description: 'Organic farm in Peru', timestamp: '2023-10-01 08:00 UTC', icon: Tractor },
  { id: '2', title: 'Ethical Labor Verified', description: 'Fair-trade certification confirmed', timestamp: '2023-10-01 12:00 UTC', icon: ShieldCheck },
  { id: '3', title: 'Packaging Facility', description: 'Packed using 100% recycled materials', timestamp: '2023-10-03 14:00 UTC', icon: Warehouse },
  { id: '4', title: 'Distribution Center', description: 'Arrived at regional hub', timestamp: '2023-10-10 05:00 UTC', icon: ShoppingCart },
];

export default function SourceVerification() {
  const [productId, setProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationStep[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    if (!productId) {
      setError('Please enter a Product ID.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      // Simulate API call
      if (productId === 'PROD-12345') {
        setResult(mockChainData);
      } else {
        setError('Product ID not found in the sustainable ledger.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <FeaturePage
      title="Sustainable Sourcing Verification"
      description="Verify the ethical and environmental claims of suppliers using our transparent ledger."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Verify Product</CardTitle>
              <CardDescription>Enter a product ID to check its journey.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="e.g., PROD-12345"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
                <Button onClick={handleVerify} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Verification Ledger</CardTitle>
              <CardDescription>The product's journey from source to store will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>Awaiting product verification...</p>
                </div>
              )}
              {result && (
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
                   {result.map((step, index) => (
                    <div key={step.id} className="relative mb-8 pl-8">
                        <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground -translate-x-1/2">
                            <step.icon className="h-4 w-4" />
                        </div>
                        <div className="font-bold">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{step.timestamp}</div>
                    </div>
                   ))}
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white -translate-x-1/2">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-green-600">Verified Sustainable</div>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </FeaturePage>
  );
}
