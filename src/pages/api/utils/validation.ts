import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  company_id: z.string().uuid()
});

export function validateProject(data: unknown) {
  return projectSchema.safeParse(data);
}