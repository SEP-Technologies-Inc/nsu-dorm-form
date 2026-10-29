import axios from 'axios';

export async function recordGeneratedDocuments(documentsCount: number): Promise<void> {
  const endpoint = import.meta.env.VITE_STATS_ENDPOINT;
  if (!endpoint) {
    return;
  }

  if (!Number.isInteger(documentsCount) || documentsCount < 1 || documentsCount > 60) {
    throw new Error('Invalid document count');
  }

  await axios.post(
    endpoint,
    { eventId: crypto.randomUUID(), documentsCount },
    { adapter: 'fetch', fetchOptions: { keepalive: true }, timeout: 5000 },
  );
}
