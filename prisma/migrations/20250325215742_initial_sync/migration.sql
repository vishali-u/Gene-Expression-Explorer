-- CreateTable
CREATE TABLE "DEGenes" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "logFC" REAL NOT NULL,
    "logCPM" REAL NOT NULL,
    "F" REAL NOT NULL,
    "PValue" REAL NOT NULL,
    "FDR" REAL NOT NULL
);
