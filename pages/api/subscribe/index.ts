import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "../../../functions/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sub, token, action } = JSON.parse(req.body);
  
  const { data, error } = await api.fetch(
    `https://oauth.reddit.com/api/subscribe?sr=${sub}&action=${action}&action_source=a${
      action == "sub" ? "&skip_initial_defaults=true" : ""
    }`,
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
