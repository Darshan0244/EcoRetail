
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { FeaturePage } from '@/components/feature-page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleFindAlternative } from '@/app/actions';
import { type FindSustainableAlternativeOutput } from '@/ai/flows/find-sustainable-alternative';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  productDescription: z.string().min(10, 'Please provide a more detailed product description.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AlternativeFinder() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindSustainableAlternativeOutput | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    const { data: alternativeResult, error } = await handleFindAlternative(data);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    } else if (alternativeResult) {
      setResult(alternativeResult);
    }
  };

  return (
    <FeaturePage
      title="AI Sustainable Alternative Finder"
      description="Describe a product, and our AI will suggest a more eco-friendly alternative and generate an image of it."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
              <CardDescription>
                Describe the product you want to find a sustainable alternative for. e.g., "a pack of 24 disposable plastic water bottles".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  {...register('productDescription')}
                  placeholder="e.g., A cheap, plastic-cased ballpoint pen that always breaks."
                  rows={4}
                />
                {errors.productDescription && (
                  <p className="text-destructive text-sm">{errors.productDescription.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Alternative...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Find Alternative
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Recommendation</CardTitle>
            <CardDescription>A sustainable product alternative will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoading && (
              <div className="space-y-4">
                 <Skeleton className="h-48 w-full rounded-lg" />
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                <Sparkles className="h-12 w-12" />
                <p className="mt-4">Your AI-generated recommendation awaits.</p>
              </div>
            )}
            {result && (
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-lg overflow-hidden border">
                   <Image
                    src={result.generatedImage}
                    alt={result.alternativeName}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-primary">{result.alternativeName}</h3>
                   <div
                    className="prose prose-sm max-w-none prose-p:text-foreground prose-ul:text-foreground prose-li:text-foreground text-foreground mt-2"
                    dangerouslySetInnerHTML={{ __html: result.justification }}
                   />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FeaturePage>
  );
}
