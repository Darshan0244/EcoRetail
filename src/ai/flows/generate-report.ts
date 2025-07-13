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
  report: z.string().describe('A concise, well-formatted report summarizing the provided content. Use HTML tags like <strong> for bolding and <p> for paragraphs.'),
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

Please generate a professional, easy-to-read report summarizing this information. Use HTML for formatting. Use <p> tags for paragraphs and <strong> tags for bolding. Do not use markdown. For example:

<p>This report summarizes the AI-powered inventory optimization for <strong>Tomatoes</strong> to minimize waste and reduce carbon emissions.</p>

<strong>Key Findings:</strong>
<ul>
  <li><strong>Optimal Inventory:</strong> 2000 units</li>
  <li><strong>Recommended Order:</strong> 1500 units</li>
  <li><strong>Waste Reduction:</strong> 15%</li>
  <li><strong>CO₂ Reduction:</strong> 5%</li>
</ul>

<strong>Justification:</strong>
<p>The AI recommends maintaining an optimal inventory level of 2000 units. Ordering 1500 units will bring the inventory up to the expected demand, while accounting for product shelf life and lead time. This strategy is projected to significantly reduce potential waste and unnecessary transportation emissions.</p>`,
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
