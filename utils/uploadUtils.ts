// Helper functions for parsing data and adding to the database

import fs from "fs";
import csvParser from "csv-parser";
import { PRISMA } from "@/utils/constants"

// Function to parse the differential expression data and store it in the 
// database. Takes the file path and delimiter as arguments.
export async function parseDEData(filePath: string) {
    return new Promise((resolve, reject) => {
        const parsed: any[] = [] // Collect the parsed data (row by row)

        // Reading in the file
        fs.createReadStream(filePath)
            .pipe(csvParser({ separator: "," }))
            .on("data", (row) => {
                parsed.push({
                    Symbol: row.gene,
                    BaseMean: parseFloat(row.baseMean),
                    Log2FC: parseFloat(row.log2FoldChange),
                    SELog2FC: parseFloat(row.lfcSE),
                    TestStat: parseFloat(row.stat),
                    PValue: parseFloat(row.pvalue),
                    PAdj: parseFloat(row.padj)
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
