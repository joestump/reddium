import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthenticatedClient } from '../../functions/reddit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subreddit, postId, sort = 'confidence' } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!subreddit || !postId) {
    return res.status(400).json({ error: 'Missing subreddit or postId' });
  }

  try {
    const redditClient = await getAuthenticatedClient(token);
    const submission = await redditClient.getSubmission(postId as string).fetch();
    const comments = await submission.comments.fetchAll({ sort: sort as string });
    
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}
