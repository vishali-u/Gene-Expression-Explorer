// API endpoint that will fetch metadata

import { NextApiRequest, NextApiResponse } from "next";
import { PRISMA } from "@/utils/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const distinctConditions = await PRISMA.metadata.findMany({
      distinct: ["Condition"],
      select: {
        Condition: true,
      },
    });

    const conditions = distinctConditions.map((item) => item.Condition);
    return res.status(200).json({ conditions });
  } catch (error: any) {
    //console.error("Error fetching conditions:", error);
    return res.status(500).json({ error: "Failed to fetch conditions" });
  }
}
