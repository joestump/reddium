import { Post, QueryParams } from "../interfaces";
import { SPECIAL_SUBREDDITS } from "./constants";
import getConfig from 'next/config';

export async function getPopularPosts({
  subreddit = "popular",
  sort_type = "hot",
  t = "day",
  limit = 25,
  after = "",
  token = ""
}: QueryParams) {
  const url =
    token != ""
      ? `https://oauth.reddit.com/r/${subreddit}/${sort_type}?limit=${limit}&after=${after}&t=${t}`
      : `https://www.reddit.com/r/${subreddit}/${sort_type}.json?limit=${limit}&after=${after}&t=${t}`;
  const headerOptions =
    token != ""
      ? {
          headers: { Authorization: `Bearer ${token}` }
        }
      : {};
  const res = await (await fetch(url, headerOptions)).json();
  const postList = await res.data.children;
  const posts: Post[] = postList.map((post: any) => post.data);
  return {
    posts: posts,
    after: res.data.after
  };
}

export async function getPopularPostsClient(params: QueryParams) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  const res = await (await fetch("/api/posts", headerOptions)).json();
  const postList = await res.data.children;
  const posts: Post[] = postList.map((post: any) => post.data);
  return {
    posts: posts,
    after: res.data.after
  };
}

export async function getSubredditInfo({ subreddit, token = "" }: QueryParams) {
  if (subreddit && SPECIAL_SUBREDDITS.includes(subreddit)) return {};
  const url =
    token != ""
      ? `https://oauth.reddit.com/r/${subreddit}/about`
      : `https://www.reddit.com/r/${subreddit}/about.json`;
  const headerOptions =
    token != ""
      ? {
          headers: { Authorization: `Bearer ${token}` }
        }
      : {};
  const res = await (await fetch(url, headerOptions)).json();
  return res.data;
}

export async function getPostInfo({
  subreddit,
  postid,
  sort = "confidence",
  token = ""
}: QueryParams) {
  const { publicRuntimeConfig } = getConfig();
  let url: string;
  if (typeof window === 'undefined') {
    const domain = publicRuntimeConfig.REDDIUM_DOMAIN;
    url = `${domain}/api/get-comments?subreddit=${encodeURIComponent(subreddit)}&postId=${encodeURIComponent(postid)}&sort=${encodeURIComponent(sort)}`;
  } else {
    // On the client, use a relative URL
    url = `/api/get-comments?subreddit=${encodeURIComponent(subreddit)}&postId=${encodeURIComponent(postid)}&sort=${encodeURIComponent(sort)}`;
  }

  const headerOptions: RequestInit = {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
  
  try {
    const res = await fetch(url, headerOptions);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return {
      comments: data.comments
    };
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function getUserPosts({
  username,
  sort = "new",
  category = "",
  t = "day",
  after = ""
}: any) {
  const res = await (
    await fetch(
      `https://www.reddit.com/user/${username}/${category}.json?sort=${sort}&after=${after}&t=${t}`
    )
  ).json();
  const postList = await res.data.children;
  const posts: Post[] = postList.map((post: any) => ({
    ...post.data,
    kind: post.kind
  }));
  return {
    posts: posts,
    after: res.data.after
  };
}

export async function getUserPostsClient(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  const res = await (await fetch("/api/user/posts", headerOptions)).json();
  const postList = await res.data.children;
  const posts: Post[] = postList.map((post: any) => post.data);
  return {
    posts: posts,
    after: res.data.after
  };
}

export async function getUserInfo({ username }: any) {
  const res = await (
    await fetch(`https://www.reddit.com/user/${username}/about.json`)
  ).json();
  return res.data;
}

export async function getSearch({
  q,
  sort = "relevance",
  t = "all",
  type = "",
  after = "",
  token = ""
}: any) {
  const url =
    token != ""
      ? `https://oauth.reddit.com/search?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`
      : `https://www.reddit.com/search/.json?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`;
  const headerOptions =
    token != ""
      ? {
          headers: { Authorization: `Bearer ${token}` }
        }
      : {};
  const res = await (await fetch(url, headerOptions)).json();
  if (res.hasOwnProperty("error") || !res.hasOwnProperty("data"))
    return {
      items: [],
      after: null
    };
  const resList = await res.data.children;
  const items: any[] = resList.map((item: any) => ({
    ...item.data,
    kind: item.kind
  }));
  return {
    items: items,
    after: res.data.after
  };
}

export async function getSearchClient(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  const res = await (await fetch("/api/search", headerOptions)).json();
  if (res.hasOwnProperty("error") || !res.hasOwnProperty("data"))
    return {
      items: [],
      after: null
    };
  const resList = await res.data.children;
  const items: any[] = resList.map((item: any) => ({
    ...item.data,
    kind: item.kind
  }));
  return {
    items: items,
    after: res.data.after
  };
}

export async function upvote(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  return await fetch("/api/vote", headerOptions);
}

export async function postSubscribe(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  return await fetch("/api/subscribe", headerOptions);
}

export async function sendSave(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  return await fetch("/api/save", headerOptions);
}

export async function sendUnsave(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  return await fetch("/api/unsave", headerOptions);
}

export async function getProfile({ token }: any) {
  const headerOptions = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return await (
    await fetch(`https://oauth.reddit.com/api/v1/me`, headerOptions)
  ).json();
}

export async function getMoreCommentsClient(params: any) {
  const headerOptions = {
    method: "POST",
    body: JSON.stringify(params)
  };
  const res = await (await fetch("/api/morecomments", headerOptions)).json();
  if (!res.hasOwnProperty("error")) {
    const comments: Post[] = res.json.data.things.map(
      (comment: any) => comment.data
    );
    return comments;
  }
  return res;
}

export async function postComment({ postId, comment, token }: { postId: string; comment: string; token: string }) {
  const headerOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ postId, comment })
  };
  const response = await fetch('/api/post-comment', headerOptions);
  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
  return response.json();
}
