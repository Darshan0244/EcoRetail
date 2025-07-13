'use server';

/**
 * @fileOverview A Genkit flow for generating a summary report.
 *
 * - generateReport - An async function that takes a feature title and content and returns a summary report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  featureTitle: z.string().describe('The title of the feature being reported on.'),
  contentSummary: z.string().describe('A summary of the current content or data on the page.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('A concise, well-formatted report summarizing the provided content. Use markdown for lists and bolding.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are a business analyst AI. Your task is to generate a concise summary report based on the provided information from a retail sustainability dashboard.

The user is viewing the "{{featureTitle}}" feature.

Here is the data currently displayed on their screen:
---
{{contentSummary}}
---

Please generate a professional, easy-to-read report summarizing this information. Use markdown for formatting, such as lists and bolding, to make the report clear and scannable.`,
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
