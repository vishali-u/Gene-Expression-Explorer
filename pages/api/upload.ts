// File upload API

import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { parseDEData } from "@/utils/uploadUtils";
import { runDESeq2 } from "@/utils/deseqUtils";
import { output } from "motion/react-client";

// Disable Next.js built-in parser for formidable to work
export const config = {
    api: {
      bodyParser: false,
    },
};

// Helper function to create a per-user workspace directory
export function createUserWorkspace() {
    const id = uuidv4();
    const dir = path.join(process.cwd(), "output", "workspaces", id);
    fs.mkdirSync(dir, { recursive: true });
    return { id, dir };
}

// Helper function to get a string field from the form data
// Prevents type errors
function getStringField(field: string | string[] | undefined): string {
  if (typeof field === "string") return field;
  if (Array.isArray(field)) return field[0];
  throw new Error("Missing required field.");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }
    
    const form = formidable({
        keepExtensions: true,
        multiples: false
    }); // TODO: include a file size limit?

    // TODO: fields is not used, so replace with _?
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // Check if the files have been uploaded
        const countsFile = Array.isArray(files.counts) ? files.counts[0] : files.counts;
        const metadataFile = Array.isArray(files.metadata) ? files.metadata[0] : files.metadata;

        if (!countsFile || !metadataFile) {
            return res.status(400).json({ 
                message: "Both counts and metadata files are required." });
        }

        console.log("files:", files);
        console.log("countsFile:", countsFile.filepath);
        console.log("metadataFile:", metadataFile.filepath);

        console.log('countsFile.filepath type:', typeof countsFile.filepath);
        console.log('metadataFile.filepath type:', typeof metadataFile.filepath);


        // Only allow .csv or .tsv files
        const allowedMimeTypes = ["text/csv", "text/tab-separated-values"];
        const countsType = countsFile.mimetype || "";
        const metadataType = metadataFile.mimetype || "";

        if (!allowedMimeTypes.includes(countsType) || !allowedMimeTypes.includes(metadataType)) {
            return res.status(400).json({ 
                message: "Invalid file type. Only .csv or .tsv allowed." });
        }

        // Parse the input file and store data in database
        try {
            // Create a user workspace
            const { id, dir } = createUserWorkspace();

            // Run the DESeq2 pipeline
            const params = {
                countsPath: countsFile.filepath,
                metadataPath: metadataFile.filepath,
                baseline: getStringField(fields.baseline),
                experimental: getStringField(fields.experimental),
                minNumSamples: parseInt(getStringField(fields.minNumSamples)),
                minCounts: parseInt(getStringField(fields.minCounts)),
                adjustMethod: getStringField(fields.adjustMethod),
                alphaThreshold: parseFloat(getStringField(fields.alphaThreshold)),
                logFCThreshold: parseFloat(getStringField(fields.logFCThreshold)),
                outputDir: dir
            };
            runDESeq2(params);

            // Parse the differential expression data and store it in the database
            const resultsFile = path.join(dir, "de_results.csv");
            await parseDEData(resultsFile);
            return res.status(200).json({ message: "Files uploaded and parsed successfully." });
        } catch (error: any) {
            // print the error that occurred in parseData
            return res.status(500).json({
                message: "Unexpected error",
                error: error?.message || String(error)
            });
        }
    })   
}

