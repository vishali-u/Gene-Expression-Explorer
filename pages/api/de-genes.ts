// API endpoint that will fetch the differentially expressed genes

import { NextApiRequest, NextApiResponse } from "next";
import { PRISMA } from "@/utils/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed." })
    }

    try {
        const genes = await PRISMA.dEGenes.findMany();
        return res.status(200).json(genes);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving data." });
    }
}