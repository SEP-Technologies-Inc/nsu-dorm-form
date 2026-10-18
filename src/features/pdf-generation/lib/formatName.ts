import { incline } from 'lvovich';

export function formatName(fullName: string): string {
  const normalized = fullName.trim().replace(/\s+/g, ' ');
  const parts = normalized.split(' ');

  if (parts.length < 2 || parts.length > 3) {
    return normalized;
  }

  const [last, first, middle] = parts;

  try {
    const result = incline({ last, first, middle }, 'genitive');

    return [result.last, result.first, result.middle].filter(Boolean).join(' ');
  } catch {
    return normalized;
  }
}
