import { useState, useEffect } from 'react';

interface Config {
  REDDIUM_SHOW_ABOUT?: boolean;
  REDDIUM_DISABLE_KOFI_LINK?: boolean;
  REDDIUM_DISABLE_GITHUB_LINK?: boolean;
  REDDIUM_THEME?: string;
  REDDIUM_CLIENT_ID?: string;
  REDDIUM_CLIENT_SECRET?: string;
  REDDIUM_DISABLE_LOGIN?: boolean;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then(response => response.json())
      .then((data: Config) => setConfig(data))
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  const safeConfig = {
    REDDIUM_SHOW_ABOUT: config?.REDDIUM_SHOW_ABOUT ?? false,
    REDDIUM_DISABLE_KOFI_LINK: config?.REDDIUM_DISABLE_KOFI_LINK ?? false,
    REDDIUM_DISABLE_GITHUB_LINK: config?.REDDIUM_DISABLE_GITHUB_LINK ?? false,
    REDDIUM_THEME: config?.REDDIUM_THEME ?? 'default',
    REDDIUM_CLIENT_ID: config?.REDDIUM_CLIENT_ID ?? '',
    REDDIUM_CLIENT_SECRET: config?.REDDIUM_CLIENT_SECRET ?? '',
    REDDIUM_DISABLE_LOGIN: config?.REDDIUM_DISABLE_LOGIN ?? true,
  };

  return { config: safeConfig };
}
