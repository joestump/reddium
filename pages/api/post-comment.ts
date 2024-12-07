import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthenticatedClient } from '../../functions/reddit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { postId, comment } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const redditClient = await getAuthenticatedClient(token);
    await redditClient.getSubmission(postId).reply(comment);
    res.status(200).json({ message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Failed to post comment' });
  }
}
