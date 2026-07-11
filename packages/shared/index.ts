import { z } from 'zod';

// ==========================================
// Enums
// ==========================================
export const ApplicationStatusEnum = z.enum([
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected'
]);

// ==========================================
// Base Models (Matches Database)
// ==========================================
export const CandidateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  linkedin_url: z.string().url("Invalid URL format").nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  candidate_id: z.string().uuid(),
  job_title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  status: ApplicationStatusEnum,
  applied_at: z.date().or(z.string()),
  salary_expectation: z.number().int().nullable().optional(),
  source: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.date().or(z.string()),
  updated_at: z.date().or(z.string()),
});

// ==========================================
// API Request Payloads (CRUD)
// ==========================================
// Create: Omit ID and timestamps
export const CreateCandidateSchema = CandidateSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateCandidateSchema = CreateCandidateSchema.partial();

export const CreateApplicationSchema = ApplicationSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

// ==========================================
// Inferred TypeScript Types
// ==========================================
export type Candidate = z.infer<typeof CandidateSchema>;
export type Application = z.infer<typeof ApplicationSchema>;
export type CreateCandidate = z.infer<typeof CreateCandidateSchema>;
export type UpdateCandidate = z.infer<typeof UpdateCandidateSchema>;
export type CreateApplication = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplication = z.infer<typeof UpdateApplicationSchema>;