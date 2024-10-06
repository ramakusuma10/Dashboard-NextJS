import type { NextApiRequest, NextApiResponse } from "next";

interface University {
  alpha_two_code: string;
  country: string;
  state_province: string | null;
  domains: string[];
  name: string;
  web_pages: string[];
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, country } = req.query;

  if (!name || !country) {
    return res
      .status(400)
      .json({ error: "Name and country query parameters are required" });
  }

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${name}&country=${country}`
    );
    const data: University[] = await response.json();

    if (!data.length) {
      return res.status(404).json({ error: "No universities found" });
    }

    const formattedData = data.map((university: University) => ({
      name: university.name,
      country: university.country,
      alpha_two_code: university.alpha_two_code,
      domains: university.domains,
      web_pages: university.web_pages,
      state_province: university.state_province,
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching universities data:", error);
    return res.status(500).json({ error: "Failed to fetch universities data" });
  }
}
