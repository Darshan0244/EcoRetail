
'use server';

import {
  optimizeInventoryLevels,
  type OptimizeInventoryLevelsInput,
  type OptimizeInventoryLevelsOutput,
} from '@/ai/flows/optimize-inventory';
import {
  optimizeEnergyConsumption,
  type OptimizeEnergyConsumptionInput,
  type OptimizeEnergyConsumptionOutput,
} from '@/ai/flows/optimize-energy-consumption';
import {
  generateReport,
  type GenerateReportInput,
  type GenerateReportOutput,
} from '@/ai/flows/generate-report';
import { z } from 'zod';

const supplyChainSchema = z.object({
  produceType: z.string().min(1, 'Produce type is required.'),
  currentInventory: z.coerce.number().min(0, 'Inventory cannot be negative.'),
  demandForecast: z.coerce.number().min(0, 'Demand forecast cannot be negative.'),
  shelfLifeDays: z.coerce.number().min(1, 'Shelf life must be at least 1 day.'),
  leadTimeDays: z.coerce.number().min(0, 'Lead time cannot be negative.'),
  storageCapacity: z.coerce.number().min(1, 'Storage capacity must be positive.'),
});

export async function handleOptimizeInventory(
  values: OptimizeInventoryLevelsInput
): Promise<{ data: OptimizeInventoryLevelsOutput | null; error: string | null }> {
  const validation = supplyChainSchema.safeParse(values);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map((e) => e.message).join(', ');
    return { data: null, error: errorMessages };
  }

  try {
    const result = await optimizeInventoryLevels(validation.data);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'An unexpected error occurred while optimizing inventory.' };
  }
}

const energyConsumptionSchema = z.object({
    storeId: z.string().min(1, 'Store ID is required.'),
    historicalEnergyData: z.string().min(1, 'Historical energy data is required.'),
    weatherData: z.string().min(1, 'Weather data is required.'),
    occupancyData: z.string().min(1, 'Occupancy data is required.'),
    equipmentData: z.string().min(1, 'Equipment data is required.'),
});

export async function handleOptimizeEnergy(
  values: OptimizeEnergyConsumptionInput
): Promise<{ data: OptimizeEnergyConsumptionOutput | null; error: string | null }> {
    const validation = energyConsumptionSchema.safeParse(values);
    if (!validation.success) {
        const errorMessages = validation.error.errors.map((e) => e.message).join(', ');
        return { data: null, error: errorMessages };
    }

    try {
        const result = await optimizeEnergyConsumption(validation.data);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An unexpected error occurred while optimizing energy consumption.' };
    }
}

const generateReportSchema = z.object({
    featureTitle: z.string(),
    contentSummary: z.string(),
});

export async function handleGenerateReport(
    values: GenerateReportInput
): Promise<{ data: GenerateReportOutput | null; error: string | null }> {
    const validation = generateReportSchema.safeParse(values);
    if (!validation.success) {
        const errorMessages = validation.error.errors.map((e) => e.message).join(', ');
        return { data: null, error: errorMessages };
    }

    try {
        const result = await generateReport(validation.data);
        return { data: result, error: null };
    } catch (e) {
        console.error(e);
        return { data: null, error: 'An unexpected error occurred while generating the report.' };
    }
}
