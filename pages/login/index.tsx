import { GetServerSideProps } from "next";
import React from "react";
import Cookies from "cookies";
import getConfig from 'next/config';
import { REDIRECT_URI } from "../../functions/constants";

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() || {};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cookies = new Cookies(req, res);
  if (query.hasOwnProperty("code")) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${publicRuntimeConfig.REDDIUM_CLIENT_ID}:${serverRuntimeConfig.REDDIUM_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: query.code ? query.code.toString() : "",
        redirect_uri: REDIRECT_URI,
      }),
    };
    const resp = await (
      await fetch("https://www.reddit.com/api/v1/access_token", requestOptions)
    ).json();
    console.log("Received access token:", resp.access_token); // Debug output
    cookies.set("token", resp.access_token, { maxAge: 600000 });
    delete query.code;
  } else {
    console.log("No code received: ", query); // Debug output
  }
  res.statusCode = 302;
  res.setHeader("Location", `/`);
  res.end();
  return {
    props: {},
  };
};

const LoginPage = () => <div></div>;

export default LoginPage;
