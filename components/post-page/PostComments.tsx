import React, { useState, useCallback, useEffect } from "react";
import { Comment } from "./Comment";
import CommentInput from './CommentInput';
import { getPostInfo } from '../../functions/service';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../interfaces';

interface PostCommentsProps {
  initialComments?: Post[];
  postId: string;
  subreddit: string;
}

const PostComments: React.FC<PostCommentsProps> = ({ initialComments = [], postId, subreddit }) => {
  const [comments, setComments] = useState<Post[]>(initialComments);
  const [isLoading, setIsLoading] = useState(!initialComments.length);
  const { token } = useAuth();

  const fetchUpdatedComments = useCallback(async () => {
    if (!subreddit || !postId) {
      console.error('Missing subreddit or postId');
      return;
    }

    setIsLoading(true);
    try {
      const result = await getPostInfo({ subreddit, postid: postId, token });
      if (result.comments) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error('Error fetching updated comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [subreddit, postId, token]);

  useEffect(() => {
    if (!initialComments.length) {
      fetchUpdatedComments();
    }
  }, [initialComments, fetchUpdatedComments]);

  const handleCommentPosted = useCallback(async () => {
    await fetchUpdatedComments();
  }, [fetchUpdatedComments]);

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="w-full mx-auto max-w-[80%] pb-2 mt-6 sm:mx-6 sm:w-auto post-content">
      <CommentInput postId={postId} onCommentPosted={handleCommentPosted} />
      {comments.length > 0 ? (
        comments.map((comment: any, ind: number) => (
          <Comment
            key={ind}
            {...comment}
            max_depth={2}
            token={token}
            checkedForMore={false}
          />
        ))
      ) : (
        <div>No comments yet.</div>
      )}
    </div>
  );
};

const CommentItem: React.FC<{ comment: Post }> = ({ comment }) => {
  // Implement the comment rendering logic here
  return (
    <div>
      <p>{comment.body}</p>
      {/* Add more comment details as needed */}
    </div>
  );
};

export default PostComments;
