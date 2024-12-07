import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../functions/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { link_id, children, token = "" } = JSON.parse(req.body);
  
  const url = `https://oauth.reddit.com/api/morechildren?api_type=json&link_id=${link_id}&children=${children}`;
  
  const { data, error } = await api.fetch(url, { token });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
}
