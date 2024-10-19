import { GetServerSideProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import {
  getUserInfo,
  getUserPosts,
  getUserPostsClient,
} from "../../../functions/service";
import React, { useState } from "react";
import TitleHead from "../../../components/TitleHead";
import { NavMenu } from "../../../components/common";
import UserPost from "../../../components/user-page/UserPost";
import UserComment from "../../../components/user-page/UserComment";
import { DOMAIN } from "../../../functions/constants";
import Cookies from "cookies";
import Logo from "../../../components/Logo";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token") || "";
  const posts = await getUserPosts({ ...query, token });
  const userInfo = await getUserInfo(query);
  return {
    props: {
      postData: { ...posts },
      userInfo,
      params: {
        ...query,
        token: token,
        category: query.params ? query.params[0] : "",
      },
    },
  };
};

const UserPage = ({ postData, userInfo, params }: any) => {
  const [{ posts, after }, setPostData] = useState(postData);
  const fetchMorePosts = async () => {
    const next = await getUserPostsClient({
      ...params,
      after: after,
    });
    setPostData({ posts: [...posts, ...next.posts], after: next.after });
  };
  return (
    <div>
      <TitleHead title={`${userInfo.name} – Reddium`}>
        <meta name="description" content={`${userInfo}'s posts on Reddium. `} />
        <meta property="og:url" content={`${DOMAIN}/user/${userInfo.name}`} />
        <meta
          property="og:description"
          content={`${userInfo}'s posts on Reddium. `}
        />
        <meta property="og:image" content={`${DOMAIN}/reddium-sub.png`} />
      </TitleHead>
      <div className="h-full hidden sm:flex py-3 px-8 items-center sub-bottom-border justify-end max-width-main mx-auto z-50 h-16">
        <div className="flex flex-row items-center">
          <NavMenu token={params.token} />
          <Logo />
        </div>
      </div>
      <header className="sub-bottom-border">
        <nav className="h-full px-4 max-width-main mx-auto z-50 h-264 lg:mx-12 sm:mx-6 sm:px-0">
          <div className="flex w-full items-center justify-end mt-6">
            <div className="flex flex-row items-center sm:hidden">
              <NavMenu token={params.token} />
              <Logo />
            </div>
          </div>
          <div className="w-full flex items-start flex-col">
            <div className="mr-8 flex flex-row items-center cursor-pointer">
              <Link className="main-black my-10" href={`/user/${userInfo.name}`}>
                <h2 className="text-5xl leading-loose font-bold sm:text-3xl sm:mt-8">
                  {userInfo.name}
                </h2>
              </Link>
            </div>
            <div className="flex flex-row items-center sub-link-grey sm:mt-2 h-16 my-2">
              <div className="mr-2 sm:ml-0">{`${userInfo.total_karma} Karma`}</div>
              <span className="px-2">·</span>
              <div className="mx-2">
                <Link className="link-black-hover" href={`/user/${userInfo.name}`}>
                  Overview
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <section className="mt-12">
        <div className="max-width-main mx-auto">
          <div className="w-full mx-auto max-w-600 pb-10">
            {posts.map((item: any, ind: number) =>
              item.kind == "t3" ? (
                <UserPost key={ind} {...item} />
              ) : (
                <UserComment key={ind} {...item} />
              )
            )}
            <div className="w-full text-center">
              <button
                className="my-4 mx-auto p-2 cursor-pointer w-48 max-w-full load-more main-black font-semibold rounded flex flex-row justify-between items-center"
                onClick={fetchMorePosts}
              >
                <div className="flex-grow text-center">Show More</div>
                <Image className="ml-3" src="/down_arrow.svg" alt="Show more" width={24} height={24} />
              </button>
            </div>
          </div>
          <div className="w-full w-user lg:hidden"></div>
        </div>
      </section>
    </div>
  );
};

export default UserPage;
