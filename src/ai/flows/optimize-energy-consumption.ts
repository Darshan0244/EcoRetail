
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
      'Specific recommendations for optimizing energy consumption, including adjusting HVAC settings, dimming lights, and scheduling equipment usage.'
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

  Provide specific recommendations for adjusting HVAC settings, dimming lights, scheduling equipment usage, and any other relevant strategies. Your response for recommendations should be a detailed, multi-point plan, using markdown for lists. Do not use bold markdown.

  Estimate the potential cost savings and energy reduction (in kWh) resulting from your recommendations.

  Store ID: {{{storeId}}}
  Historical Energy Data: {{{historicalEnergyData}}}
  Weather Data: {{{weatherData}}}
  Occupancy Data: {{{occupancyData}}}
  Equipment Data: {{{equipmentData}}}
  `,
  output: {
    schema: z.object({
      energySavingRecommendations: z.string().default(`1. HVAC Optimization:
- Reduce HVAC load by 10% during peak hours (12-3 PM) by increasing the thermostat temperature by 1-2°C. Target specific adjustments for units serving areas with fluctuating occupancy.
- Implement a proactive maintenance schedule for the 5 HVAC units, prioritizing the oldest units, to improve efficiency and prevent breakdowns. Budget for potential replacements of the oldest, least efficient units.
- Utilize smart thermostats with occupancy sensors to automatically adjust temperatures in areas with low or no occupancy. Consider a setback temperature of 2-3°C during unoccupied periods.
2. Lighting Optimization:
- Implement daylight harvesting strategies by dimming LED lights near windows during sunny afternoons (especially facing south and west). Adjust dimming levels based on real-time light sensor readings.
- Install timers or occupancy sensors in non-essential areas (storage rooms, restrooms) to ensure lights are only on when needed.
- Calibrate lighting controls to optimize lighting levels for different times of the day and night, reducing unnecessary brightness during off-peak hours.
3. Refrigeration Optimization:
- Implement a regular maintenance schedule for the 10 refrigeration units, including coil cleaning and door seal checks, to maintain optimal cooling efficiency. Consider replacing older, less efficient units.
- Monitor refrigeration unit temperatures regularly and adjust settings to minimize energy consumption while maintaining food safety standards.
- Install strip curtains or air curtains at refrigeration unit openings to reduce cold air loss and energy usage.
4. Equipment Scheduling:
- Shift energy-intensive tasks, such as floor cleaning or restocking, to off-peak hours (early morning or late evening) to reduce strain on the grid during peak demand periods.
- Implement a power management system for computers and other electronic devices to automatically put them into sleep mode when not in use.
5. Weather Response:
- Proactively adjust HVAC settings based on real-time weather forecasts. On days with lower temperatures or cloud cover, reduce HVAC usage accordingly.
- Utilize window coverings (blinds, shades) to minimize solar heat gain during hot, sunny days.`),
      estimatedSavings: z.string().default('Implementing these recommendations is estimated to result in a 10-15% reduction in energy consumption, translating to a savings of 50-75 kWh per day. Potential cost savings can vary depending on local energy prices but are estimated to be in the range of $2,000-$3,500 annually. Significant savings can be made from HVAC replacements in the medium to long term.'),
    })
  }
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
