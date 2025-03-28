// Helper functions for parsing data and adding to the database

import fs from "fs";
import csvParser from "csv-parser";
import { PRISMA } from "@/utils/constants"

export async function parseData(filePath: string, delimiter: string) {
    return new Promise((resolve, reject) => {
        const parsed: any[] = [] // Collect the parsed data (row by row)

        // Reading in the file
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: delimiter }))
            .on("data", (row) => {
                parsed.push({
                    symbol: row.GeneName,
                    logFC: parseFloat(row.logFC),
                    logCPM: parseFloat(row.logCPM),
                    F: parseFloat(row.F),
                    PValue: parseFloat(row.PValue),
                    FDR: parseFloat(row.FDR)
                });
            })

            // Add to the database once the end of the file is reached
            .on("end", async () => {
                
                try {
                    // Ensure the database is empty before adding new data
                    await PRISMA.dEGenes.deleteMany({});

                    await PRISMA.dEGenes.createMany({
                        data: parsed
                    });
                    
                    resolve("Data stored succesfully");
                } catch(error) {
                    //console.error("Database Error:", error)
                    reject(error)
                }
            })

            .on("error", (error: Error) => {
                //console.error("File Reading Error:", error)
                reject(error);
            })
    });
}
