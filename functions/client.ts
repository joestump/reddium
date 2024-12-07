import Snoowrap from 'snoowrap';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export function getClient(token?: string) {
  return new Snoowrap({
    userAgent: 'Reddium',
    clientId: publicRuntimeConfig.REDDIUM_CLIENT_ID,
    clientSecret: publicRuntimeConfig.REDDIUM_CLIENT_SECRET,
    accessToken: token
  });
}
