import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../functions/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    q,
    sort = "relevance",
    t = "all",
    type = "",
    after = "",
    token = ""
  } = JSON.parse(req.body);

  const url = token
    ? `https://oauth.reddit.com/search?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`
    : `https://www.reddit.com/search/.json?q=${q}&sort=${sort}&t=${t}&after=${after}&type=${type}`;

  const { data, error } = await api.fetch(url, { token });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}
