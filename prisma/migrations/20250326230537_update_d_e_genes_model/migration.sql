/*
  Warnings:

  - The primary key for the `dEGenes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `dEGenes` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dEGenes" (
    "symbol" TEXT NOT NULL PRIMARY KEY,
    "logFC" REAL NOT NULL,
    "logCPM" REAL NOT NULL,
    "F" REAL NOT NULL,
    "PValue" REAL NOT NULL,
    "FDR" REAL NOT NULL
);
INSERT INTO "new_dEGenes" ("F", "FDR", "PValue", "logCPM", "logFC", "symbol") SELECT "F", "FDR", "PValue", "logCPM", "logFC", "symbol" FROM "dEGenes";
DROP TABLE "dEGenes";
ALTER TABLE "new_dEGenes" RENAME TO "dEGenes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
