/*
  Warnings:

  - The primary key for the `dEGenes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `F` on the `dEGenes` table. All the data in the column will be lost.
  - You are about to drop the column `FDR` on the `dEGenes` table. All the data in the column will be lost.
  - You are about to drop the column `logCPM` on the `dEGenes` table. All the data in the column will be lost.
  - You are about to drop the column `logFC` on the `dEGenes` table. All the data in the column will be lost.
  - You are about to drop the column `symbol` on the `dEGenes` table. All the data in the column will be lost.
  - Added the required column `BaseMean` to the `dEGenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Log2FC` to the `dEGenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PAdj` to the `dEGenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SELog2FC` to the `dEGenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Symbol` to the `dEGenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TestStat` to the `dEGenes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dEGenes" (
    "Symbol" TEXT NOT NULL PRIMARY KEY,
    "BaseMean" REAL NOT NULL,
    "Log2FC" REAL NOT NULL,
    "SELog2FC" REAL NOT NULL,
    "TestStat" REAL NOT NULL,
    "PValue" REAL NOT NULL,
    "PAdj" REAL NOT NULL
);
INSERT INTO "new_dEGenes" ("PValue") SELECT "PValue" FROM "dEGenes";
DROP TABLE "dEGenes";
ALTER TABLE "new_dEGenes" RENAME TO "dEGenes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
