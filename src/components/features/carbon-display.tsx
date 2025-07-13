
'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FeaturePage } from '@/components/feature-page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const products = {
  apples: {
    name: 'Apples (1kg)',
    footprint: 0.43,
    breakdown: [
      { name: 'Production', value: 0.2, fill: 'hsl(var(--chart-1))' },
      { name: 'Transport', value: 0.15, fill: 'hsl(var(--chart-2))' },
      { name: 'Packaging', value: 0.08, fill: 'hsl(var(--chart-4))' },
    ],
  },
  beef: {
    name: 'Beef (1kg)',
    footprint: 60,
    breakdown: [
      { name: 'Production', value: 55, fill: 'hsl(var(--chart-1))' },
      { name: 'Transport', value: 2, fill: 'hsl(var(--chart-2))' },
      { name: 'Packaging', value: 3, fill: 'hsl(var(--chart-4))' },
    ],
  },
  tshirt: {
    name: 'Cotton T-Shirt',
    footprint: 7,
    breakdown: [
      { name: 'Production', value: 5, fill: 'hsl(var(--chart-1))' },
      { name: 'Transport', value: 1.5, fill: 'hsl(var(--chart-2))' },
      { name: 'Packaging', value: 0.5, fill: 'hsl(var(--chart-4))' },
    ],
  },
};

type ProductKey = keyof typeof products;

export default function CarbonDisplay() {
  const [selectedProductKey, setSelectedProductKey] = useState<ProductKey>('apples');

  const selectedProduct = products[selectedProductKey];

  return (
    <FeaturePage
      title="Interactive Carbon Footprint"
      description="Visually understand the carbon footprint of products to make informed, sustainable decisions."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Carbon Footprint Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedProduct.breakdown} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-sm">
                            <p className="font-bold">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              {`CO2e: ${payload[0].value} kg`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" background={{ fill: 'hsl(var(--background))' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a Product</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedProductKey} onValueChange={(value) => setSelectedProductKey(value as ProductKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(products).map((key) => (
                    <SelectItem key={key} value={key}>{products[key as ProductKey].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold font-headline text-primary">{selectedProduct.footprint.toFixed(2)} kg</p>
              <p className="text-muted-foreground">CO₂ equivalent</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </FeaturePage>
  );
}
