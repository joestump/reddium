import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../../functions/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    username,
    sort = "new",
    category = "",
    t = "day",
    token = "",
    after = ""
  } = JSON.parse(req.body);

  const url = `https://www.reddit.com/user/${username}/${category}.json?sort=${sort}&after=${after}&t=${t}`;
  
  const { data, error } = await api.fetch(url, { token });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}
