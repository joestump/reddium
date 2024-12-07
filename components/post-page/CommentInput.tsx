import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postComment } from '../../functions/service';

interface CommentInputProps {
  postId: string;
  onCommentPosted: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, onCommentPosted }) => {
  const [comment, setComment] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to comment.');
      return;
    }
    try {
      await postComment({ postId, comment, token });
      setComment('');
      onCommentPosted();
      alert('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-2 mx-4 px-6 py-3 input-shadow rounded">
      <textarea
        className="w-full p-2 border rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
      />
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!comment.trim()}
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentInput;
