// Helper functions for parsing data and adding to the database

import fs from "fs";
import csvParser from "csv-parser";
import { PRISMA } from "@/utils/constants"
import { DE_GENES_COLUMNS } from "@/utils/constants";

export async function parseData(filePath: string, delimiter: string) {
    return new Promise((resolve, reject) => {
        const parsed: any[] = [] // Collect the parsed data (row by row)

        // Reading in the file
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: delimiter, headers: DE_GENES_COLUMNS }))
            .on("data", (row) => {
                parsed.push({
                    symbol: row.GeneName,
                    logFC: row.logFC,
                    logCPM: row.logCPM,
                    F: row.F,
                    PValue: row.PValue,
                    FDR: row.FDR
                });
            })
            .on("end", async () => {
                // Add to the database once the end of the file is reached
                try {
                    await PRISMA.dEGenes.createMany({
                        data: parsed
                    });
                    resolve("Data stored succesfully");
                } catch(error) {
                    // To prevent TypeScript error
                    if (error instanceof Error) {
                        reject(`Error while storing data: ${error.message}`);
                    } else {
                        reject("Unknown error while storing data");
                    }
                }
            })
            .on("error", (error: Error) => {
                reject(`Error reading the file: ${error.message}`);
            })
    });
}
