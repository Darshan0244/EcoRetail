
'use server';

/**
 * @fileOverview AI-Driven Energy Management flow.
 *
 * - optimizeEnergyConsumption - A function that optimizes energy consumption in retail stores.
 * - OptimizeEnergyConsumptionInput - The input type for the optimizeEnergyConsumption function.
 * - OptimizeEnergyConsumptionOutput - The return type for the optimizeEnergyConsumption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeEnergyConsumptionInputSchema = z.object({
  storeId: z.string().describe('The ID of the retail store.'),
  historicalEnergyData: z
    .string()
    .describe(
      'Historical energy consumption data for the store, including date, time, and energy usage in kWh.'
    ),
  weatherData: z
    .string()
    .describe(
      'Current and predicted weather data for the store location, including temperature, humidity, and sunlight.'
    ),
  occupancyData: z
    .string()
    .describe(
      'Real-time occupancy data for the store, including the number of customers and staff present.'
    ),
  equipmentData: z
    .string()
    .describe(
      'Information about the store’s equipment, including HVAC systems, lighting, and refrigeration units.'
    ),
});
export type OptimizeEnergyConsumptionInput = z.infer<
  typeof OptimizeEnergyConsumptionInputSchema
>;

const OptimizeEnergyConsumptionOutputSchema = z.object({
  energySavingRecommendations: z
    .string()
    .describe(
      'Specific recommendations for optimizing energy consumption, formatted as an HTML unordered list (<ul><li>...</li></ul>).'
    ),
  estimatedSavings: z
    .string()
    .describe(
      'Estimated cost savings and energy reduction (in kWh) resulting from implementing the recommendations.'
    ),
});
export type OptimizeEnergyConsumptionOutput = z.infer<
  typeof OptimizeEnergyConsumptionOutputSchema
>;

export async function optimizeEnergyConsumption(
  input: OptimizeEnergyConsumptionInput
): Promise<OptimizeEnergyConsumptionOutput> {
  return optimizeEnergyConsumptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeEnergyConsumptionPrompt',
  input: {schema: OptimizeEnergyConsumptionInputSchema},
  output: {schema: OptimizeEnergyConsumptionOutputSchema},
  prompt: `You are an AI-powered energy management consultant for retail stores.

  Analyze the provided data to provide actionable recommendations for optimizing energy consumption in the store. Consider factors such as historical energy usage, weather conditions, store occupancy, and equipment data.

  Provide specific recommendations. Your response for recommendations should be a detailed, multi-point plan, formatted as an HTML unordered list. For example: "<h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>". Do not use markdown.

  Estimate the potential cost savings and energy reduction (in kWh) resulting from your recommendations.

  Store ID: {{{storeId}}}
  Historical Energy Data: {{{historicalEnergyData}}}
  Weather Data: {{{weatherData}}}
  Occupancy Data: {{{occupancyData}}}
  Equipment Data: {{{equipmentData}}}
  `,
});

const optimizeEnergyConsumptionFlow = ai.defineFlow(
  {
    name: 'optimizeEnergyConsumptionFlow',
    inputSchema: OptimizeEnergyConsumptionInputSchema,
    outputSchema: OptimizeEnergyConsumptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
