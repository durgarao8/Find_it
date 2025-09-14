'use server';
/**
 * @fileOverview An AI agent that matches a found item image with lost item submissions.
 *
 * - imageMatchingForLostItems - A function that handles the image matching process.
 * - ImageMatchingForLostItemsInput - The input type for the imageMatchingForLostItems function.
 * - ImageMatchingForLostItemsOutput - The return type for the imageMatchingForLostItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageMatchingForLostItemsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the found item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' //keep the backslashes
    ),
  lostItemDescriptions: z
    .array(z.string())
    .describe('A list of descriptions of lost items.'),
});
export type ImageMatchingForLostItemsInput = z.infer<
  typeof ImageMatchingForLostItemsInputSchema
>;

const ImageMatchingForLostItemsOutputSchema = z.object({
  matchingItemDescription: z
    .string()
    .describe('The description of the lost item that best matches the found item image, or null if no match is found.'),
});
export type ImageMatchingForLostItemsOutput = z.infer<
  typeof ImageMatchingForLostItemsOutputSchema
>;

export async function imageMatchingForLostItems(
  input: ImageMatchingForLostItemsInput
): Promise<ImageMatchingForLostItemsOutput> {
  return imageMatchingForLostItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageMatchingForLostItemsPrompt',
  input: {schema: ImageMatchingForLostItemsInputSchema},
  output: {schema: ImageMatchingForLostItemsOutputSchema},
  prompt: `You are an AI assistant that matches a found item image with descriptions of lost items.

  Given a photo of a found item and a list of descriptions of lost items, determine which description best matches the found item in the photo.
  If there is a clear match, return the description of the matching lost item.
  If there are multiple potential matches, return the description that is the most likely match.
  If there is no reasonable match, return null.

  Here are the descriptions of the lost items:
  {{#each lostItemDescriptions}}
  - {{{this}}}
  {{/each}}

  Here is the photo of the found item:
  {{media url=photoDataUri}}
  `,
});

const imageMatchingForLostItemsFlow = ai.defineFlow(
  {
    name: 'imageMatchingForLostItemsFlow',
    inputSchema: ImageMatchingForLostItemsInputSchema,
    outputSchema: ImageMatchingForLostItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
