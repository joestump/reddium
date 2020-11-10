import Subpage from "../../../components/Subpage";
import { zipObject } from "lodash";

import { Dropdown } from "../../../components/common";
import { GetServerSideProps } from "next";
import { getPopularPosts, getSubredditInfo } from "../../api/posts";
import {
  POPULAR_PARAM_KEY,
  POPULAR_PARAM_DEFAULT,
  SORT_TYPE,
  TIME_FILTER
} from "../../../functions/constants";
import React, { useState } from "react";
import Header from "../../../components/subreddit-page/Header";
import SubWideCard from "../../../components/subreddit-page/SubWideCard";
import SubGridCard from "../../../components/subreddit-page/SubGridCard";
import SubredditInfo from "../../../components/subreddit-page/SubredditInfo";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log(query);
  const posts = await getPopularPosts({
    ...query,
    sort_type: query.hasOwnProperty("params") ? query.params[0] : "hot"
  });
  const subredditInfo = await getSubredditInfo(query);
  return {
    props: {
      postData: { ...posts },
      subredditInfo,
      params: {
        ...query,
        sort_type: query.hasOwnProperty("params") ? query.params[0] : "hot"
      }
    }
  };
};

const SubredditPage = ({ postData, subredditInfo, params }: any) => {
  const [{ posts, after }, setPostData] = useState(postData);
  const [selectedParams, setSelectedParams] = useState({
    ...zipObject(POPULAR_PARAM_KEY, POPULAR_PARAM_DEFAULT),
    ...params
  });

  const filterPopular = () => {
    setPostData({ posts: new Array(15).fill({}) });
    window.location.href = `/r/${selectedParams.subreddit}/${selectedParams.sort_type}?t=${selectedParams.t}&limit=${selectedParams.limit}`;
  };

  return (
    <Subpage title={subredditInfo.display_name} backgroundColor="rgb(250,250,250)">
      <Header {...params} />
      <section className="w-full mx-auto max-width-sub pb-10 mt-6 lg:w-auto lg:mx-12">
        <header className="sub-bottom-border pb-2">
          <span className="text-lg sub-opacity-68">Featured</span>
        </header>
        <div className="my-6 flex flex-row flex-wrap">
          {posts.slice(0, 3).map((p: any) => (
            <SubGridCard key={p.id} {...p} />
          ))}
        </div>
      </section>
      <section className="hidden mx-12 w-auto max-width-sub pb-10 mt-6 md:block">
            <SubredditInfo {...subredditInfo} />
            <div className="h-full pt-8">
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
            </div>
      </section>
      <div className="w-full flex main-container max-width-sub pb-4 posts-grid md:block lg:w-auto lg:mx-12">
        <div className="w-full mb-4 grid-left">
          <header className="sub-bottom-border pb-2">
            <span className="text-lg sub-opacity-68">Trending</span>
          </header>
          {posts.slice(3, posts.length).map((p: any) => (
            <SubWideCard key={p.id} {...p} />
          ))}
        </div>
        <div className="grid-right md:hidden">
          <div className="sticky top-8 p-8">
            <SubredditInfo {...subredditInfo} />
            <div className="h-full pt-8">
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
            </div>
          </div>
        </div>
      </div>
    </Subpage>
  );
};

export default SubredditPage;
