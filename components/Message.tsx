import React from 'react';

interface MessageProps {
  message: {
    id: string;
    subject: string;
    author: string;
    body: string;
    created_utc: number;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="message-container p-4 border rounded">
      <h2 className="text-2xl font-bold mb-2">{message.subject}</h2>
      <p className="text-sm text-gray-600 mb-2">From: {message.author}</p>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(message.created_utc * 1000).toLocaleString()}
      </p>
      <div className="message-body whitespace-pre-wrap">{message.body}</div>
    </div>
  );
};

export default Message;
