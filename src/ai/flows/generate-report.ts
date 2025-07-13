
'use server';

/**
 * @fileOverview A Genkit flow for generating a text report.
 *
 * - generateReport - An async function that creates a text report.
 * - GenerateReportInput - The input type for the function.
 * - GenerateReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateReportInputSchema = z.object({
  featureTitle: z.string().describe('The title of the feature being reported on.'),
  contentSummary: z.string().describe('A summary of the user-generated content or result to be reported on.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  reportText: z.string().describe('A detailed report in HTML format. Use <p> for paragraphs and <ul><li> for lists.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const generateReportTextPrompt = ai.definePrompt({
    name: 'generateReportTextPrompt',
    input: { schema: GenerateReportInputSchema },
    output: { schema: GenerateReportOutputSchema },
    prompt: `You are a sustainability consultant AI for EcoRetail.
    Your task is to generate a very concise summary report based on the user's interaction with a specific feature.
    Keep the report to a maximum of 3-4 sentences and one short bulleted list if necessary.
    
    The user was on the "{{featureTitle}}" page.
    Here is the data or result they generated:
    "{{contentSummary}}"

    Based on this, provide a helpful summary. Explain the key results and their implications for sustainability.
    Format the report as an HTML string. Use <p> tags for paragraphs and <ul><li> tags for lists.
    `,
});


const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the text report
    const { output } = await generateReportTextPrompt(input);
    if (!output?.reportText) {
      throw new Error('Could not generate the text report.');
    }
    
    return {
        reportText: output.reportText,
    };
  }
);
