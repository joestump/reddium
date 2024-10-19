import { useState, useEffect } from 'react';

export function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetch('/api/config')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  return { config };
}
