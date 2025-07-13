
'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { FeaturePage } from '@/components/feature-page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleOptimizeInventory } from '@/app/actions';
import { type OptimizeInventoryLevelsOutput } from '@/ai/flows/optimize-inventory';
import { Loader2, Bot, BarChart, Package, Wind, Trash2 } from 'lucide-react';

const formSchema = z.object({
  produceType: z.string().min(1, 'Produce type is required.'),
  currentInventory: z.coerce.number().min(0, 'Inventory cannot be negative.'),
  demandForecast: z.coerce.number().min(0, 'Demand forecast cannot be negative.'),
  shelfLifeDays: z.coerce.number().min(1, 'Shelf life must be at least 1 day.'),
  leadTimeDays: z.coerce.number().min(0, 'Lead time cannot be negative.'),
  storageCapacity: z.coerce.number().min(1, 'Storage capacity must be positive.'),
});

type FormValues = z.infer<typeof formSchema>;

const exampleData: FormValues = {
    produceType: "Tomatoes",
    currentInventory: 500,
    demandForecast: 2000,
    shelfLifeDays: 14,
    leadTimeDays: 2,
    storageCapacity: 3000,
};

const StatCard = ({ icon: Icon, title, value, unit }: { icon: React.ElementType, title: string, value: string | number, unit?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {unit && <p className="text-xs text-muted-foreground">{unit}</p>}
        </CardContent>
    </Card>
);

export default function SupplyChainAI() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeInventoryLevelsOutput | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const { data: optimizationResult, error } = await handleOptimizeInventory(data);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    } else if (optimizationResult) {
      setResult(optimizationResult);
    }
  };

  const handleLoadExample = () => {
    reset(exampleData);
  };

  return (
    <FeaturePage
      title="Supply Chain AI"
      description="Predict and optimize inventory levels to minimize waste and reduce carbon emissions from transportation."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Details</CardTitle>
            <CardDescription>Enter details about the product to be optimized.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produceType">Produce Type</Label>
                <Input id="produceType" {...register('produceType')} placeholder="e.g., Tomatoes" />
                {errors.produceType && <p className="text-destructive text-sm">{errors.produceType.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentInventory">Current Inventory (units)</Label>
                <Input id="currentInventory" type="number" {...register('currentInventory')} placeholder="e.g., 500" />
                {errors.currentInventory && <p className="text-destructive text-sm">{errors.currentInventory.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="demandForecast">Demand Forecast (units)</Label>
                <Input id="demandForecast" type="number" {...register('demandForecast')} placeholder="e.g., 2000" />
                {errors.demandForecast && <p className="text-destructive text-sm">{errors.demandForecast.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="shelfLifeDays">Shelf Life (days)</Label>
                <Input id="shelfLifeDays" type="number" {...register('shelfLifeDays')} placeholder="e.g., 14" />
                {errors.shelfLifeDays && <p className="text-destructive text-sm">{errors.shelfLifeDays.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
                <Input id="leadTimeDays" type="number" {...register('leadTimeDays')} placeholder="e.g., 2" />
                {errors.leadTimeDays && <p className="text-destructive text-sm">{errors.leadTimeDays.message}</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="storageCapacity">Storage Capacity (units)</Label>
                <Input id="storageCapacity" type="number" {...register('storageCapacity')} placeholder="e.g., 3000" />
                {errors.storageCapacity && <p className="text-destructive text-sm">{errors.storageCapacity.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Optimize Inventory
              </Button>
              <Button type="button" variant="outline" onClick={handleLoadExample}>
                Load Example
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
            <CardDescription>AI-powered recommendations will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Optimizing with AI...</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                  <Bot className="h-12 w-12" />
                  <p className="mt-4">Your AI insights will be generated here.</p>
              </div>
            )}
            {result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={BarChart} title="Optimal Inventory" value={result.optimalInventoryLevel} unit="units" />
                        <StatCard icon={Package} title="Recommended Order" value={result.orderQuantity} unit="units" />
                        <StatCard icon={Trash2} title="Waste Reduction" value={`${result.potentialWasteReduction}%`} />
                        <StatCard icon={Wind} title="CO₂ Reduction" value={`${result.carbonEmissionReduction}%`} />
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mt-4">Justification</h3>
                        <p className="text-sm text-muted-foreground">{result.justification}</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}
