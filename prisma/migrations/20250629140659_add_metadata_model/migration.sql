-- CreateTable
CREATE TABLE "metadata" (
    "id" SERIAL NOT NULL,
    "SampleName" TEXT NOT NULL,
    "Condition" TEXT NOT NULL,

    CONSTRAINT "metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metadata_SampleName_key" ON "metadata"("SampleName");
