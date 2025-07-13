
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
import { Wind, Sprout } from 'lucide-react';

const formSchema = z.object({
  weight: z.coerce.number().positive('Weight must be positive.'),
  distance: z.coerce.number().positive('Distance must be positive.'),
});

type FormValues = z.infer<typeof formSchema>;

// Factor in kg of CO2 per ton-km. Source: EPA
const EMISSION_FACTOR = 0.12; 

interface ShippingCalcProps {
  onResult?: (result: any) => void;
}

export default function ShippingCalc({ onResult }: ShippingCalcProps) {
  const { toast } = useToast();
  const [emissions, setEmissions] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Convert weight to tons for calculation
    const weightInTons = data.weight / 1000;
    const calculatedEmissions = weightInTons * data.distance * EMISSION_FACTOR;
    setEmissions(calculatedEmissions);
  };
  
  const handleOffset = () => {
    if (emissions === null) return;
    toast({
      title: 'Carbon Offset Successful',
      description: `Successfully offset ${emissions.toFixed(2)} kg of CO₂e. Thank you for your contribution!`,
    });
    setEmissions(null);
    reset();
  };

  return (
    <FeaturePage
      title="Carbon-Neutral Shipping Calculator"
      description="Calculate and offset the carbon emissions from your shipments."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
              <CardDescription>Enter the weight and distance to calculate emissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Package Weight (kg)</Label>
                <Input id="weight" type="number" step="0.1" {...register('weight')} placeholder="e.g., 5.5" />
                {errors.weight && <p className="text-destructive text-sm">{errors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input id="distance" type="number" {...register('distance')} placeholder="e.g., 1200" />
                {errors.distance && <p className="text-destructive text-sm">{errors.distance.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Calculate Emissions</Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card className="flex flex-col items-center justify-center text-center">
            {emissions === null ? (
                <div className="p-8">
                    <Wind className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Your emission calculation will appear here.</p>
                </div>
            ) : (
                <div className="p-8">
                    <CardTitle>Estimated Emissions</CardTitle>
                    <p className="text-5xl font-bold font-headline text-primary my-4">{emissions.toFixed(2)}</p>
                    <p className="text-muted-foreground">kg of CO₂ equivalent</p>
                    <Button onClick={handleOffset} className="mt-6" variant="secondary">
                        <Sprout className="mr-2 h-4 w-4" />
                        Offset Carbon Footprint
                    </Button>
                </div>
            )}
        </Card>
      </div>
    </FeaturePage>
  );
}
