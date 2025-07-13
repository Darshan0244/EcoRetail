
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { FeaturePage } from '@/components/feature-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const packagingOptions = [
  { id: 'mushroom', name: 'Mushroom Packaging', imageUrl: 'https://www.grown.bio/wp-content/uploads/2023/09/mushroom-packaging-flat-top.jpg', dataAiHint: 'mushroom packaging', biodegradable: true, compostable: true, recyclable: false, description: 'Made from mycelium, it\'s fully biodegradable and compostable. Great for protecting fragile items.', suitability: { type: ['electronics', 'cosmetics'], volume: ['small', 'medium'], distance: ['short', 'medium'] } },
  { id: 'seaweed', name: 'Seaweed Pouch', imageUrl: 'https://www.yankodesign.com/images/design_news/2020/09/edible-food-packaging-made-from-seaweed-has-the-potential-to-offset-carbon-emissions-entirely/03-seaweedu_yankodesign.jpg', dataAiHint: 'seaweed pouch', biodegradable: true, compostable: true, recyclable: false, description: 'Edible and water-soluble, perfect for food products or small items. Disappears without a trace.', suitability: { type: ['food', 'cosmetics'], volume: ['small'], distance: ['short'] } },
  { id: 'air-pillows', name: 'Recycled Air Pillows', imageUrl: 'https://m.media-amazon.com/images/I/91MAeuydRTL.jpg', dataAiHint: 'air pillows', biodegradable: false, compostable: false, recyclable: true, description: 'Made from recycled materials, these are lightweight and great for void fill. Can be recycled at designated facilities.', suitability: { type: ['all'], volume: ['all'], distance: ['all'] } },
  { id: 'cardboard', name: 'Corrugated Cardboard', imageUrl: 'https://mushroompackaging.com/cdn/shop/files/Treaty_in_Ecovative_Tray_3.jpg?v=1679340875', dataAiHint: 'cardboard box', biodegradable: true, compostable: true, recyclable: true, description: 'A versatile, widely recycled option made from paper pulp. Available in various strengths.', suitability: { type: ['all'], volume: ['all'], distance: ['all'] } },
  { id: 'cornstarch', name: 'Cornstarch Packaging', imageUrl: 'https://mushroompackaging.com/cdn/shop/files/Small_cooler_both_Pieces.jpg?v=1670267413', dataAiHint: 'cornstarch foam', biodegradable: true, compostable: true, recyclable: false, description: 'A plant-based alternative to styrofoam peanuts. Dissolves in water and is fully compostable.', suitability: { type: ['electronics', 'glassware'], volume: ['medium', 'large'], distance: ['short', 'medium'] } },
];

export default function PackageGuide() {
  const [productType, setProductType] = useState('electronics');
  const [volume, setVolume] = useState('medium');
  const [distance, setDistance] = useState('medium');

  const recommendations = useMemo(() => {
    return packagingOptions.filter(opt => {
      const typeMatch = opt.suitability.type.includes(productType) || opt.suitability.type.includes('all');
      const volumeMatch = opt.suitability.volume.includes(volume) || opt.suitability.volume.includes('all');
      const distanceMatch = opt.suitability.distance.includes(distance) || opt.suitability.distance.includes('all');
      return typeMatch && volumeMatch && distanceMatch;
    });
  }, [productType, volume, distance]);

  return (
    <FeaturePage
      title="Eco-Friendly Packaging Guide"
      description="Find the perfect sustainable packaging for your products based on their needs."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Product Type</label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="cosmetics">Cosmetics</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="glassware">Glassware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Volume</label>
                <Select value={volume} onValueChange={setVolume}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Shipping Distance</label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(opt => (
              <Card key={opt.id} className="flex flex-col">
                <CardHeader>
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                     <Image src={opt.imageUrl} alt={opt.name} layout="fill" objectFit="cover" data-ai-hint={opt.dataAiHint} />
                  </div>
                  <CardTitle>{opt.name}</CardTitle>
                  <CardDescription>{opt.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                   <div className="flex flex-wrap gap-2">
                    {opt.biodegradable && <Badge variant="secondary">Biodegradable</Badge>}
                    {opt.compostable && <Badge variant="secondary">Compostable</Badge>}
                    {opt.recyclable && <Badge variant="secondary">Recyclable</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
             {recommendations.length === 0 && (
                <Card className="md:col-span-2 flex items-center justify-center p-8">
                    <p className="text-muted-foreground">No specific recommendations. Consider standard recycled cardboard.</p>
                </Card>
            )}
          </div>
        </div>
      </div>
    </FeaturePage>
  );
}
