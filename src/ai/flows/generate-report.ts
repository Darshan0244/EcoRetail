'use server';

/**
 * @fileOverview A Genkit flow for generating a summary report and an audio version of it.
 *
 * - generateReport - An async function that takes a feature title and content and returns a summary report with audio.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateReportInputSchema = z.object({
  featureTitle: z.string().describe('The title of the feature being reported on.'),
  contentSummary: z.string().describe('A summary of the current content or data on the page.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A concise, well-formatted report summarizing the provided content. Use HTML tags like <strong> for bolding and <p> for paragraphs.'
    ),
  audioDataUri: z
    .string()
    .describe(
      "A data URI of the generated audio report. Expected format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(
  input: GenerateReportInput
): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {
    schema: z.object({
      report: GenerateReportOutputSchema.shape.report,
    }),
  },
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

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    // Generate the text report first
    const {output: textOutput} = await reportPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate text report.');
    }

    // Now, generate the audio from the text report
    // We strip HTML tags for a cleaner audio output.
    const audioPrompt = textOutput.report.replace(/<[^>]*>?/gm, '');

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: audioPrompt,
    });

    if (!media?.url) {
      throw new Error('Failed to generate audio report.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      report: textOutput.report,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
