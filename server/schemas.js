import { z } from 'zod';

import { RATE_CARD, REGIONS } from './data/site/pricing.js';

const durationIds = RATE_CARD.durations.map((d) => d.id);
const storeMixIds = RATE_CARD.storeMix.map((m) => m.id);
const stateNames = REGIONS.map((r) => r.state);

const phone = z
  .string()
  .trim()
  .min(8, 'Enter a valid phone number')
  .max(20, 'Enter a valid phone number')
  .regex(/^[+\d][\d\s-]+$/, 'Enter a valid phone number');

export const quoteSchema = z.object({
  hubs: z
    .number()
    .int()
    .min(RATE_CARD.minHubs, `Minimum booking is ${RATE_CARD.minHubs} hubs`)
    .max(500),
  duration: z.enum(durationIds),
  storeMix: z.enum(storeMixIds),
});

export const leadSchema = quoteSchema
  .extend({
    name: z.string().trim().min(2, 'Tell us your name').max(80),
    brand: z.string().trim().min(2, 'Tell us the brand name').max(80),
    email: z.string().trim().email('Enter a valid email'),
    phone,
    state: z.enum(stateNames),
    // "state" books every live city in the state; "city" pins it to one or
    // more chosen cities — at least one is only required in the latter case.
    scope: z.enum(['state', 'city']).default('state'),
    cities: z.array(z.string().trim().min(1)).max(50).default([]),
    preferredStart: z.coerce.date().optional(),
  })
  .refine((data) => data.scope !== 'city' || data.cities.length > 0, {
    message: 'Choose at least one city',
    path: ['cities'],
  });

export const callRequestSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(80),
  brand: z.string().trim().min(2, 'Tell us the brand name').max(80),
  email: z.string().trim().email('Enter a valid email'),
  phone,
});

export const storeApplicationSchema = z.object({
  ownerName: z.string().trim().min(2, 'Tell us your name').max(80),
  storeName: z.string().trim().min(2, 'Tell us the store name').max(80),
  phone,
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  locality: z.string().trim().min(2, 'Which area is the store in?').max(80),
  city: z.string().trim().min(2).max(80),
  state: z.enum(stateNames),
  storeSize: z.enum(['under500', '500to1500', 'over1500']),
});
