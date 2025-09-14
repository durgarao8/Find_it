import { config } from 'dotenv';
config();

import '@/ai/flows/detect-item-location.ts';
import '@/ai/flows/image-matching-lost-items.ts';
import '@/ai/flows/generate-item-description.ts';
import '@/ai/flows/translate-text.ts';
