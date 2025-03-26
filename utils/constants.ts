// Store constants in this file

import { PrismaClient } from "@prisma/client";

export const PRISMA = new PrismaClient();
export const DE_GENES_COLUMNS = ["GeneName", "logFC", "logCPM", "F", "PValue", "FDR"]