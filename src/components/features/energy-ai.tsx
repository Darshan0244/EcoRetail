
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
import { Textarea } from '@/components/ui/textarea';
import { handleOptimizeEnergy } from '@/app/actions';
import { type OptimizeEnergyConsumptionOutput } from '@/ai/flows/optimize-energy-consumption';
import { Loader2, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required.'),
  historicalEnergyData: z.string().min(1, 'Historical data is required.'),
  weatherData: z.string().min(1, 'Weather data is required.'),
  occupancyData: z.string().min(1, 'Occupancy data is required.'),
  equipmentData: z.string().min(1, 'Equipment data is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EnergyAI() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeEnergyConsumptionOutput | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        storeId: '',
        historicalEnergyData: '',
        weatherData: '',
        occupancyData: '',
        equipmentData: '',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const { data: optimizationResult, error } = await handleOptimizeEnergy(data);
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

  return (
    <FeaturePage
      title="AI-Driven Energy Management"
      description="Optimize energy consumption in your retail stores to reduce costs and environmental impact."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Energy Data Input</CardTitle>
            <CardDescription>Provide data for the store you want to analyze.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeId">Store ID</Label>
                <Input id="storeId" {...register('storeId')} placeholder="e.g., STORE-001" />
                {errors.storeId && <p className="text-destructive text-sm">{errors.storeId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="historicalEnergyData">Historical Energy Data</Label>
                <Textarea id="historicalEnergyData" {...register('historicalEnergyData')} placeholder="e.g., Avg 500kWh/day, peaks in summer afternoons." />
                {errors.historicalEnergyData && <p className="text-destructive text-sm">{errors.historicalEnergyData.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weatherData">Weather Data</Label>
                <Textarea id="weatherData" {...register('weatherData')} placeholder="e.g., 25°C, sunny, high humidity." />
                {errors.weatherData && <p className="text-destructive text-sm">{errors.weatherData.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupancyData">Occupancy Data</Label>
                <Textarea id="occupancyData" {...register('occupancyData')} placeholder="e.g., Peak traffic 12-3 PM on weekdays." />
                {errors.occupancyData && <p className="text-destructive text-sm">{errors.occupancyData.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentData">Equipment Data</Label>
                <Textarea id="equipmentData" {...register('equipmentData')} placeholder="e.g., 5 HVAC units (10 years old), LED lighting, 10 refrigeration units." />
                {errors.equipmentData && <p className="text-destructive text-sm">{errors.equipmentData.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Optimize Now
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
                <p className="mt-4">Analyzing data...</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg">
                <Lightbulb className="h-12 w-12" />
                <p className="mt-4">Your energy saving insights are waiting.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-primary">Energy Saving Recommendations</h3>
                   <div 
                    className="prose prose-sm max-w-none prose-p:text-foreground prose-ul:text-foreground prose-li:text-foreground text-foreground" 
                    dangerouslySetInnerHTML={{__html: result.energySavingRecommendations.replace(/\n/g, '<br />') }} 
                   />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-primary">Estimated Savings</h3>
                  <p className="text-foreground">{result.estimatedSavings}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}
