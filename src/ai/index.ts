/**
 * @fileoverview This file is the entrypoint for all Genkit flows.
 *
 * It is used by the Genkit CLI to start the flows server.
 */

import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-inventory';
import '@/ai/flows/optimize-energy-consumption';
import '@/ai/flows/find-sustainable-alternative';
import '@/ai/flows/generate-report';
