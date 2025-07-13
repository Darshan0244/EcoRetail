'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting optimal inventory levels for produce in retail, aiming to minimize waste and reduce transportation emissions.
 *
 * - optimizeInventoryLevels - An async function that takes produce information and returns optimized inventory levels.
 * - OptimizeInventoryLevelsInput - The input type for the optimizeInventoryLevels function.
 * - OptimizeInventoryLevelsOutput - The return type for the optimizeInventoryLevels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeInventoryLevelsInputSchema = z.object({
  produceType: z.string().describe('The type of produce (e.g., tomatoes, lettuce).'),
  currentInventory: z.number().describe('The current inventory level of the produce.'),
  demandForecast: z.number().describe('The forecasted demand for the produce in units.'),
  shelfLifeDays: z.number().describe('The shelf life of the produce in days.'),
  leadTimeDays: z.number().describe('The lead time for replenishment in days.'),
  storageCapacity: z.number().describe('The maximum storage capacity for the produce.'),
});
export type OptimizeInventoryLevelsInput = z.infer<typeof OptimizeInventoryLevelsInputSchema>;

const OptimizeInventoryLevelsOutputSchema = z.object({
  optimalInventoryLevel: z
    .number()
    .describe('The recommended optimal inventory level to minimize waste.'),
  orderQuantity: z.number().describe('The recommended order quantity to replenish stock.'),
  potentialWasteReduction: z
    .number()
    .describe('The estimated reduction in waste by implementing the recommendation.'),
  carbonEmissionReduction: z
    .number()
    .describe(
      'The estimated reduction in carbon emissions from reduced transportation due to optimized inventory.'
    ),
  justification: z.string().describe('The justification for the recommendation.'),
});
export type OptimizeInventoryLevelsOutput = z.infer<typeof OptimizeInventoryLevelsOutputSchema>;

export async function optimizeInventoryLevels(
  input: OptimizeInventoryLevelsInput
): Promise<OptimizeInventoryLevelsOutput> {
  return optimizeInventoryLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeInventoryLevelsPrompt',
  input: {schema: OptimizeInventoryLevelsInputSchema},
  output: {schema: OptimizeInventoryLevelsOutputSchema},
  prompt: `You are an AI assistant that specializes in optimizing inventory levels for retail produce to minimize waste and reduce carbon emissions.

  Based on the following information, provide an optimal inventory level, order quantity, potential waste reduction, carbon emission reduction, and a justification for your recommendations.

  Produce Type: {{{produceType}}}
  Current Inventory: {{{currentInventory}}}
  Demand Forecast: {{{demandForecast}}}
  Shelf Life (Days): {{{shelfLifeDays}}}
  Lead Time (Days): {{{leadTimeDays}}}
  Storage Capacity: {{{storageCapacity}}}

  Consider factors such as demand variability, shelf life, and storage capacity to provide the best recommendations.

  Respond in the following JSON format:
  {
    "optimalInventoryLevel": "",
    "orderQuantity": "",
    "potentialWasteReduction": "",
    "carbonEmissionReduction": "",
    "justification": ""
  }`,
});

const optimizeInventoryLevelsFlow = ai.defineFlow(
  {
    name: 'optimizeInventoryLevelsFlow',
    inputSchema: OptimizeInventoryLevelsInputSchema,
    outputSchema: OptimizeInventoryLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
