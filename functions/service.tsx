import { api} from './api';
import { Post, QueryParams } from "../interfaces";
import { SPECIAL_SUBREDDITS } from "./constants";

export async function getPopularPosts({
  subreddit = "popular",
  sort_type = "hot",
  t = "day",
  limit = 25,
  after = "",
  token = ""
}: QueryParams) {
  const url = token
    ? `https://oauth.reddit.com/r/${subreddit}/${sort_type}?limit=${limit}&after=${after}&t=${t}`
    : `https://www.reddit.com/r/${subreddit}/${sort_type}.json?limit=${limit}&after=${after}&t=${t}`;

  const { data, error } = await api.fetch(url, { token });
  
  if (error || !data?.data?.children) {
    console.error('Failed to fetch popular posts:', error);
    return { posts: [], after: null };
  }

  return {
    posts: data.data.children.map((post: any) => post.data),
    after: data.data.after
  };
}

export async function getPopularPostsClient(params: QueryParams) {
  const { data, error } = await api.fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(params)
  });

  if (error || !data?.data?.children) {
    console.error('Failed to fetch client posts:', error);
    return { posts: [], after: null };
  }

  return {
    posts: data.data.children.map((post: any) => post.data),
    after: data.data.after
  };
}

export async function getSubredditInfo({ subreddit, token = "" }: QueryParams) {
  if (subreddit && SPECIAL_SUBREDDITS.includes(subreddit)) return {};
  
  const url = token
    ? `https://oauth.reddit.com/r/${subreddit}/about`
    : `https://www.reddit.com/r/${subreddit}/about.json`;

  const { data, error } = await api.fetch(url, { token });
  
  if (error) {
    console.error('Failed to fetch subreddit info:', error);
    return {};
  }
  
  return data.data;
}

export async function getPostInfo({
  subreddit,
  postid,
  commentid,
  sort = "confidence",
  token = ""
}: QueryParams) {
  const postReq = commentid == "" ? postid : `${postid}/eightants/${commentid}`;
  const url = token
    ? `https://oauth.reddit.com/r/${subreddit}/comments/${postReq}?sort=${sort}`
    : `https://www.reddit.com/r/${subreddit}/comments/${postReq}.json?sort=${sort}`;

  const { data, error } = await api.fetch(url, { token });
  
  if (error) {
    console.error('Failed to fetch post info:', error);
    return { post: null, comments: [] };
  }

  const comments = data[1].data.children.map((post: any) => post.data);
  return {
    post: data[0].data.children[0].data,
    comments
  };
}

export async function getUserPosts({
  username,
  sort = "new",
  category = "",
  t = "day",
  after = ""
}: any) {
  const url = `https://www.reddit.com/user/${username}/${category}.json?sort=${sort}&after=${after}&t=${t}`;
  
  const { data, error } = await api.fetch(url);
  
  if (error || !data?.data?.children) {
    console.error('Failed to fetch user posts:', error);
    return { posts: [], after: null };
  }

  const posts = data.data.children.map((post: any) => ({
    ...post.data,
    kind: post.kind
  }));

  return {
    posts,
    after: data.data.after
  };
}

export async function getUserPostsClient(params: any) {
  const { data, error } = await api.fetch("/api/user/posts", {
    method: "POST",
    body: JSON.stringify(params)
  });

  if (error || !data?.data?.children) {
    console.error('Failed to fetch client user posts:', error);
    return { posts: [], after: null };
  }

  return {
    posts: data.data.children.map((post: any) => post.data),
    after: data.data.after
  };
}

export async function getUserInfo({ username }: any) {
  const { data, error } = await api.fetch(
    `https://www.reddit.com/user/${username}/about.json`
  );

  if (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }

  return data.data;
}

export async function getSearch({
  q,
  sort = "relevance",
  t = "all",
  type = "",
  after = "",
  token = ""
}: any) {
  const url = token
    ? `https://oauth.reddit.com/search?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`
    : `https://www.reddit.com/search/.json?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`;

  const { data, error } = await api.fetch(url, { token });

  if (error || !data?.data) {
    console.error('Failed to fetch search results:', error);
    return { items: [], after: null };
  }

  const items = data.data.children.map((item: any) => ({
    ...item.data,
    kind: item.kind
  }));

  return {
    items,
    after: data.data.after
  };
}

export async function getSearchClient(params: any) {
  const { data, error } = await api.fetch("/api/search", {
    method: "POST",
    body: JSON.stringify(params)
  });

  if (error || !data?.data) {
    console.error('Failed to fetch client search results:', error);
    return { items: [], after: null };
  }

  const items = data.data.children.map((item: any) => ({
    ...item.data,
    kind: item.kind
  }));

  return {
    items,
    after: data.data.after
  };
}

export async function upvote(params: any) {
  return api.fetch("/api/vote", {
    method: "POST",
    body: JSON.stringify(params)
  });
}

export async function postSubscribe(params: any) {
  return api.fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify(params)
  });
}

export async function sendSave(params: any) {
  return api.fetch("/api/save", {
    method: "POST",
    body: JSON.stringify(params)
  });
}

export async function sendUnsave(params: any) {
  return api.fetch("/api/unsave", {
    method: "POST",
    body: JSON.stringify(params)
  });
}

export async function getProfile({ token }: any) {
  const { data, error } = await api.fetch(
    'https://oauth.reddit.com/api/v1/me',
    { token }
  );

  if (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }

  return data;
}

export async function getMoreCommentsClient(params: any) {
  const { data, error } = await api.fetch("/api/morecomments", {
    method: "POST",
    body: JSON.stringify(params)
  });

  if (error) {
    console.error('Failed to fetch more comments:', error);
    return [];
  }

  return data.json.data.things.map((comment: any) => comment.data);
}
