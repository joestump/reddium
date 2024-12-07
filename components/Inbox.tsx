import React from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  subject: string;
  author: string;
  body: string;
  created_utc: number;
}

interface InboxProps {
  messages: Message[];
}

const Inbox: React.FC<InboxProps> = ({ messages }) => {
  return (
    <div className="inbox-container">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      {messages.map((message) => (
        <Link href={`/me/messages/${message.id}`} key={message.id}>
          <div className="message-preview p-4 border-b hover:bg-gray-100 cursor-pointer">
            <h3 className="font-semibold">{message.subject}</h3>
            <p className="text-sm text-gray-600">From: {message.author}</p>
            <p className="text-sm text-gray-500">
              {new Date(message.created_utc * 1000).toLocaleString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Inbox;
