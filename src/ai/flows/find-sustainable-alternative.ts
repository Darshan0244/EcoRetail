
'use server';
/**
 * @fileOverview A Genkit flow for finding sustainable product alternatives and generating an image.
 *
 * - findSustainableAlternative - An async function that finds an alternative and generates an image.
 * - FindSustainableAlternativeInput - The input type for the function.
 * - FindSustainableAlternativeOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindSustainableAlternativeInputSchema = z.object({
  productDescription: z.string().describe('A description of the product to find an alternative for.'),
});
export type FindSustainableAlternativeInput = z.infer<typeof FindSustainableAlternativeInputSchema>;

const FindSustainableAlternativeOutputSchema = z.object({
  alternativeName: z.string().describe('The name of the suggested sustainable product.'),
  justification: z.string().describe('A detailed justification of why the suggested alternative is more sustainable, formatted as an HTML string. Use <p> for paragraphs and <ul><li> for lists.'),
  generatedImage: z.string().describe("A data URI of a generated image of the alternative product. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type FindSustainableAlternativeOutput = z.infer<typeof FindSustainableAlternativeOutputSchema>;

export async function findSustainableAlternative(
  input: FindSustainableAlternativeInput
): Promise<FindSustainableAlternativeOutput> {
  return findSustainableAlternativeFlow(input);
}

const findAlternativePrompt = ai.definePrompt({
    name: 'findAlternativePrompt',
    input: { schema: FindSustainableAlternativeInputSchema },
    output: { schema: z.object({
        alternativeName: FindSustainableAlternativeOutputSchema.shape.alternativeName,
        justification: FindSustainableAlternativeOutputSchema.shape.justification,
    })},
    prompt: `You are a sustainable products expert for a company called EcoRetail.
    A user has provided a description of a product. Your task is to suggest a more sustainable alternative.

    Product Description: "{{productDescription}}"

    Provide a compelling alternative. In your justification, explain why it's better for the environment. Consider materials, manufacturing processes, reusability, and end-of-life (compostable, recyclable).
    
    Format the justification as an HTML string. Use <p> and <ul>/<li> tags for clear, readable formatting.
    For example: "<p>Instead of a plastic bottle, consider a reusable glass bottle.</p><ul><li>Reduces single-use plastic waste.</li><li>Glass is infinitely recyclable.</li></ul>"
    `,
});

const generateImagePrompt = `A photorealistic image of the following product, presented in a clean, minimalist style suitable for an e-commerce store: `;

const findSustainableAlternativeFlow = ai.defineFlow(
  {
    name: 'findSustainableAlternativeFlow',
    inputSchema: FindSustainableAlternativeInputSchema,
    outputSchema: FindSustainableAlternativeOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the text-based alternative suggestion.
    const { output: textOutput } = await findAlternativePrompt(input);
    if (!textOutput) {
        throw new Error('Could not generate a sustainable alternative.');
    }

    // Step 2: Generate an image based on the suggestion.
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `${generateImagePrompt} ${textOutput.alternativeName}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Failed to generate an image for the alternative product.');
    }

    // Step 3: Combine text and image into the final output.
    return {
      alternativeName: textOutput.alternativeName,
      justification: textOutput.justification,
      generatedImage: media.url,
    };
  }
);
