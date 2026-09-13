import { describe, expect, it } from 'vitest';
import { CreateCandidateSchema, UpdateApplicationSchema } from './index';

describe('CreateCandidateSchema', () => {
  const base = { name: 'Ada Lovelace', email: 'ada@example.com' };

  it('accepts a minimal candidate', () => {
    expect(CreateCandidateSchema.safeParse(base).success).toBe(true);
  });

  it('accepts an https:// linkedin_url', () => {
    expect(CreateCandidateSchema.safeParse({ ...base, linkedin_url: 'https://www.linkedin.com/in/ada' }).success).toBe(true);
  });

  it.each(['http://www.linkedin.com/in/ada', 'javascript:alert(1)', 'data:text/html,hi', 'not a url'])(
    'rejects linkedin_url %s',
    (linkedin_url) => {
      expect(CreateCandidateSchema.safeParse({ ...base, linkedin_url }).success).toBe(false);
    }
  );

  it('rejects an empty name and an invalid email', () => {
    expect(CreateCandidateSchema.safeParse({ ...base, name: '' }).success).toBe(false);
    expect(CreateCandidateSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
  });
});

describe('UpdateApplicationSchema', () => {
  it('coerces a date-input string to a Date', () => {
    const parsed = UpdateApplicationSchema.parse({ applied_at: '2026-09-01' });
    expect(parsed.applied_at).toBeInstanceOf(Date);
  });

  it('strips candidate_id so an application cannot be reassigned', () => {
    const parsed = UpdateApplicationSchema.parse({ candidate_id: '3f1c2b1e-8a4d-4c2b-9f6e-1a2b3c4d5e6f', notes: 'x' });
    expect(parsed).toEqual({ notes: 'x' });
  });

  it('rejects an unknown status', () => {
    expect(UpdateApplicationSchema.safeParse({ status: 'bogus' }).success).toBe(false);
  });
});
