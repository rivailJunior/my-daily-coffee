import { z } from "zod";

/**
 * Your .env variables will be parsed here
 */
const envSchema = z.object({});

export const env = envSchema.parse(process.env);
