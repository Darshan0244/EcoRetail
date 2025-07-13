
'use server';

/**
 * @fileOverview A Genkit flow for generating a text and audio report.
 *
 * - generateReport - An async function that creates a text and audio report.
 * - GenerateReportInput - The input type for the function.
 * - GenerateReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const GenerateReportInputSchema = z.object({
  featureTitle: z.string().describe('The title of the feature being reported on.'),
  contentSummary: z.string().describe('A summary of the user-generated content or result to be reported on.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  reportText: z.string().describe('A detailed report in HTML format. Use <p> for paragraphs and <ul><li> for lists.'),
  reportAudio: z.string().describe("A data URI of the generated audio report. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
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
    output: { schema: z.object({ reportText: GenerateReportOutputSchema.shape.reportText }) },
    prompt: `You are a sustainability consultant AI for EcoRetail.
    Your task is to generate a very concise summary report based on the user's interaction with a specific feature.
    
    The user was on the "{{featureTitle}}" page.
    Here is the data or result they generated:
    "{{contentSummary}}"

    Based on this, provide a helpful summary. Explain the key results and their implications for sustainability. Keep the report to a maximum of 3-4 sentences and one short bulleted list if necessary.
    Format the report as an HTML string. Use <p> tags for paragraphs and <ul><li> tags for lists.
    `,
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

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

// Simple function to strip HTML for a cleaner TTS input
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, ' ');
}

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the text report
    const { output: textOutput } = await generateReportTextPrompt(input);
    if (!textOutput?.reportText) {
      throw new Error('Could not generate the text report.');
    }

    const reportText = textOutput.reportText;
    const cleanTextForSpeech = stripHtml(reportText);

    // Step 2: Generate the audio from the clean text
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A high-quality female voice
                },
            },
        },
        prompt: cleanTextForSpeech,
    });

    if (!media?.url) {
      throw new Error('Failed to generate audio for the report.');
    }
    
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    // Step 3: Return both the text and audio
    return {
      reportText,
      reportAudio: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
