import { GetServerSideProps } from "next";
import React from "react";
import { setCookie } from 'nookies';
import getConfig from 'next/config';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const config = getConfig().publicRuntimeConfig;

  if (query.code) {
    try {
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.REDDIUM_CLIENT_ID}:${config.REDDIUM_CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: query.code as string,
          redirect_uri: `${config.REDDIUM_DOMAIN}/login`,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        setCookie(context, 'token', data.access_token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        });
      } 
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  } 

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

const LoginPage = () => {
  return <div>Processing login...</div>;
};

export default LoginPage;
