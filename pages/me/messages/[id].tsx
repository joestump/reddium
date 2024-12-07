import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Message from '../../../components/Message';

const MessagePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (id && token) {
      fetchMessage();
    }
  }, [id, token]);

  const fetchMessage = async () => {
    try {
      const response = await fetch(`/api/get-message?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Message message={message} />
    </div>
  );
};

export default MessagePage;
