// File upload handler
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    // Create an upload directory
    const uploadDir = path.join(process.cwd(), "/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create it if not exists
    }

    // Use formidable to allow file uploads
    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        multiples: false 
    }) // TODO: include a file size limit?

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: err.message })
        }

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!uploadedFile) {
            return res.status(400).json({ message: "No file uploaded." })
        }

        // Check file type (either .tsv or .csv)
        const allowedMimeTypes = ["text/csv", "text/tab-separated-values"];
        if (!uploadedFile.mimetype || !allowedMimeTypes.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ message: "Invalid file type. Only .csv or .tsv allowed." });
        }

        // Get file name
        const customFileName = fields.fileName ? fields.fileName[0] : uploadedFile.originalFilename;

        // Successful upload
        res.status(200).json({
            message: "File uploaded successfully.",
            filename: customFileName
        })
    })   
}
