// File upload API

import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { parseData } from "@/utils/parseData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    // Create an upload directory
    const uploadDir = path.join(process.cwd(), "/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Use formidable module for file uploads
    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        multiples: false 
    }); // TODO: include a file size limit?

    // TODO: fields is not used, so replace with _?
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // Only one file should be uploaded
        // To prevent TypeScript error, check if files.file is an array
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!uploadedFile) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Only allow .csv or .tsv files
        const allowedMimeTypes = ["text/csv", "text/tab-separated-values"];
        const delimiter = uploadedFile.mimetype === "text/csv" ? "," : "\t";

        if (!uploadedFile.mimetype || !allowedMimeTypes.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ message: "Invalid file type. Only .csv or .tsv allowed." });
        }

        // Parse the input file and store data in database
        try {
            await parseData(uploadedFile.filepath, delimiter);
            res.status(200).json({ message: "File uploaded and data stored successfully." });
        } catch (error) {
            // To prevent TypeScript error
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Unknown error" });
            }
        }
    })   
}
