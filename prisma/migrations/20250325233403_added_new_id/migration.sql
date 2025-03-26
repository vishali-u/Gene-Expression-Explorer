/*
  Warnings:

  - You are about to drop the `DEGenes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DEGenes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "dEGenes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "logFC" REAL NOT NULL,
    "logCPM" REAL NOT NULL,
    "F" REAL NOT NULL,
    "PValue" REAL NOT NULL,
    "FDR" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "dEGenes_symbol_key" ON "dEGenes"("symbol");
