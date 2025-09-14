'use server';

/**
 * @fileOverview An AI agent that detects the item's location from the description and image,
 * and suggests standardized tags and options.
 *
 * - detectItemLocation - A function that handles the item location detection process.
 * - DetectItemLocationInput - The input type for the detectItemLocation function.
 * - DetectItemLocationOutput - The return type for the detectItemLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectItemLocationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the lost item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  description: z.string().describe('The description of the lost item.'),
});
export type DetectItemLocationInput = z.infer<typeof DetectItemLocationInputSchema>;

const DetectItemLocationOutputSchema = z.object({
  locationTags: z
    .array(z.string())
    .describe('Standardized location tags extracted from the description and image.'),
  suggestedOptions: z
    .array(z.string())
    .describe('Suggested options for categorizing the lost item.'),
});
export type DetectItemLocationOutput = z.infer<typeof DetectItemLocationOutputSchema>;

export async function detectItemLocation(input: DetectItemLocationInput): Promise<DetectItemLocationOutput> {
  return detectItemLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectItemLocationPrompt',
  input: {schema: DetectItemLocationInputSchema},
  output: {schema: DetectItemLocationOutputSchema},
  prompt: `You are an AI assistant designed to detect the location of a lost item from its description and image, and suggest standardized tags and options.

Analyze the following information to identify the location of the lost item and suggest relevant tags and options:

Description: {{{description}}}
Photo: {{media url=photoDataUri}}

Based on the description and image, extract standardized location tags and suggest options for categorizing the lost item. Return the location tags and suggested options in a JSON format.

Example:
{
  "locationTags": ["park", "bench", "near the entrance"],
  "suggestedOptions": ["lost", "found", "item", "location"]
}
`,
});

const detectItemLocationFlow = ai.defineFlow(
  {
    name: 'detectItemLocationFlow',
    inputSchema: DetectItemLocationInputSchema,
    outputSchema: DetectItemLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
