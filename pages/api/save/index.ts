import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../functions/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postid, token } = JSON.parse(req.body);
  
  const { data, error } = await api.fetch(
    `https://oauth.reddit.com/api/save?id=${postid}`,
    {
      method: "POST",
      token
    }
  );

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json(data || {});
}
