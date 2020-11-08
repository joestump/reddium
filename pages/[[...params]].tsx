import Layout from "../components/Layout";
import { zipObject } from "lodash";

import MidCard from "../components/home-page/MidCard";
import { Dropdown, MidContainer } from "../components/common";
import { GetServerSideProps } from "next";
import { getPopularPosts } from "./api/posts";
import LargeCard from "../components/home-page/LargeCard";
import {
  POPULAR_PARAM_KEY,
  POPULAR_PARAM_DEFAULT,
  SORT_TYPE,
  TIME_FILTER
} from "../functions/constants";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import RankedCard from "../components/home-page/RankedCard";
import WideCard from "../components/home-page/WideCard";
import { Post, PostList } from "../interfaces";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log(query);
  const posts = await getPopularPosts({
    ...query,
    sort_type: query.hasOwnProperty("params") ? query.params[0] : "hot"
  });
  const trendingSubs = await getPopularPosts({
    subreddit: "trendingsubreddits",
    sort_type: "new",
    limit: 1
  });
  return {
    props: {
      postData: { ...posts },
      trendingSubs,
      params: {
        ...query,
        sort_type: query.hasOwnProperty("params") ? query.params[0] : "hot"
      }
    }
  };
};

const IndexPage = ({ postData, trendingSubs, params }: any) => {
  const router = useRouter();
  const [{ posts, after }, setPostData] = useState(postData);
  // const [nextPosts, setNextPosts] = useState<PostList>({})
  const [selectedParams, setSelectedParams] = useState({
    ...zipObject(POPULAR_PARAM_KEY, POPULAR_PARAM_DEFAULT),
    ...params
  });
  const loader = useRef<HTMLDivElement>(null);

  const filterPopular = async () => {
    setPostData({ posts: new Array(15).fill({}) });
    router.push({
      pathname: selectedParams.hasOwnProperty(SORT_TYPE)
        ? selectedParams[SORT_TYPE]
        : "",
      query: selectedParams
    });
    setPostData(await getPopularPosts(selectedParams));
  };

  const fetchMorePosts = async () => {
    console.log(posts, after)
      const next = await getPopularPosts({
        ...selectedParams,
        after: after
      });
      setPostData({ ...next, posts: [...posts, ...next.posts] });
    };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(fetchMorePosts);
  //   if (loader.current) observer.observe(loader.current);
  //   return () => {
  //     if (loader.current) observer.unobserve(loader.current);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log(nextPosts)
  //   if (nextPosts.hasOwnProperty("posts")) setPostData(nextPosts)
  // }, [nextPosts]);

  // const fetchMorePosts = async (entities: any) => {
  //   const target = entities[0];
  //   console.log(entities[0], posts, after)
  //   if (target.isIntersecting) {
  //     const next = await getPopularPosts({
  //       ...selectedParams,
  //       after: after
  //     });
  //     setNextPosts(next.posts ? { ...next, posts: [...posts, ...next.posts] } : { ...nextPosts, posts: [{} as Post] });
  //   }
  // };

  return (
    <Layout title="Reddium">
      <div className="w-full main-container max-width-main pb-10">
        <MidContainer>
          <LargeCard {...posts[0]} />
        </MidContainer>
        <MidContainer>
          {posts.slice(1, 5).map((p: any) => (
            <MidCard key={p.id} {...p} />
          ))}
        </MidContainer>
        <MidContainer>
          <div className="h-full container-divide pl-8">
            <div className="mb-12">
              <p className="heading-text text-sm leading-4 uppercase tracking-wide">
                Popular posts
              </p>

              <Dropdown
                key={SORT_TYPE}
                id={SORT_TYPE}
                dataObj={selectedParams}
                updateParams={setSelectedParams}
              />
              {selectedParams.sort_type == "top" ? (
                <Dropdown
                  key={TIME_FILTER}
                  id={TIME_FILTER}
                  dataObj={selectedParams}
                  updateParams={setSelectedParams}
                />
              ) : (
                ""
              )}
              <button
                className="my-4 p-2 cursor-pointer w-48 max-w-full btn-black text-white rounded"
                onClick={filterPopular}
              >
                Filter
              </button>
            </div>
            <div className="mb-6">
              <div className="mb-5">
                <p className="heading-text text-sm leading-4 uppercase tracking-wide">
                  Trending subreddits
                </p>
              </div>
              <div>
                {trendingSubs.hasOwnProperty("posts") ? (
                  trendingSubs.posts[0].title
                    .split(":")[1]
                    .split(",")
                    .slice(0, 3)
                    .map((sub: string, ind: number) => (
                      <div
                        key={ind}
                        className="mb-3 pb-3 sub-bottom-border justify-between flex items-center"
                      >
                        <a
                          className="heading-text tracking-wide"
                          href={"https://reddit.com" + sub}
                        >
                          {sub}
                        </a>
                        <button className="px-3 py-1 cursor-pointer rounded btn-outline-green text-sm">
                          Follow
                        </button>
                      </div>
                    ))
                ) : (
                  <div className="shimmer">
                    <div className="h-4 w-full mb-5 mx-3 pb-3 shimmer-bg"></div>
                    <div className="h-4 w-full mb-5 mx-3 pb-3 shimmer-bg"></div>
                    <div className="h-4 w-full mb-5 mx-3 pb-3 shimmer-bg"></div>
                  </div>
                )}
                <a
                  className="main-green text-sm"
                  href="https://reddit.com/r/trendingsubreddits"
                >
                  See More
                </a>
              </div>
            </div>
          </div>
        </MidContainer>
      </div>
      <div className="w-full main-container max-width-main pb-4 pt-10 sub-top-border">
        <div className="w-full flex mb-4 flex-row items-center">
          <img className="mr-3" src="trending.svg" />
          <div>
            <p className="heading-text text-sm leading-4 uppercase tracking-wide">
              Trending on Reddit
            </p>
          </div>
        </div>
        <div className="w-full flex mb-4 flex-row items-start flex-wrap">
          {posts.slice(5, 11).map((p: any, ind: number) => (
            <RankedCard key={p.id} rank={ind + 6} {...p} />
          ))}
        </div>
      </div>
      <div className="w-full main-container max-width-main pb-4 pt-10 sub-top-border posts-grid">
        <div className="w-full mb-4 grid-left">
          {posts.slice(11, posts.length).map((p: any) => (
            <WideCard key={p.id} {...p} />
          ))}
          <div className="w-full text-center" ref={loader}>
            {/* <WideCard {...({} as Post)} /> */}
            <button
                className="my-4 mx-auto  p-2 cursor-pointer w-64 max-w-full btn-black text-white rounded"
                onClick={fetchMorePosts}
              >
                Load More
              </button>
          </div>
        </div>
        <div className="grid-right">
          <div className="sticky top-8 p-8 about-bg flex flex-col">
            <div className="w-full flex mb-4 flex-row items-center">
              <img className="mr-3" src="bookmarks.svg" />
              <div>
                <p className="heading-text text-sm leading-4 uppercase tracking-wide">
                  About Reddium
                </p>
              </div>
            </div>
            <div className="w-full">
              <p>Lorem ipsum dolor sin amet</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
