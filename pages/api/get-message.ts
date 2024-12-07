import type { NextApiRequest, NextApiResponse } from 'next';
import { getClient } from '../../functions/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Missing message ID' });
  }

  try {
    const reddit = getClient(token);
    const message = await reddit.getMessage(id as string);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
}
