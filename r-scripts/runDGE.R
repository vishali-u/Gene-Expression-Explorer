# Run differential gene expression analysis for the given RNA-seq data

# Load required libraries
library(DESeq2)
library(dplyr)
library(tidyverse)
#setClassUnion("ExpData", c("matrix", "SummarizedExperiment")) # needed for new version of DESeq2 (https://support.bioconductor.org/p/9161859/#9161863)

# Parse data
args <- commandArgs(trailingOnly = TRUE)
countsPath <- args[1]
metadataPath <- args[2]
baseline <- args[3]
experimental <- args[4]
minNumSamples <- as.integer(args[5])
minCounts <- as.integer(args[6])
adjustMethod <- args[7]
alphaThreshold <- as.numeric(args[8])
logFCThreshold <- as.numeric(args[9])

######## Load data ########
counts <- read_csv(countsPath)
metadata <- read_csv(metadataPath)

# Set the gene IDs in the counts as row names
counts <- counts %>%
  column_to_rownames(var = colnames(counts)[1]) %>%
  as.data.frame()

# Set the sample IDs in the metadata as row names
metadata <- metadata %>%
  column_to_rownames(var = colnames(metadata)[1]) %>%
  as.data.frame()

# Ignore capitalization
colnames(metadata) <- tolower(colnames(metadata))

# If there are multiple conditions, only include the baseline and experimental 
metadata <- metadata %>%
  filter(condition %in% c(baseline, experimental))

counts <- counts[, rownames(metadata)]

# Make sure counts column names match metadata row names
stopifnot(all(colnames(counts) == rownames(metadata)))


######## Filter out lowly expressed genes ########
# Remove genes that do not have the minimum number of reads in the minimum 
# number of samples
counts <- counts[rowSums(counts >= minCounts) >= minNumSamples, ]


######## Run DESeq2 Pipeline ########
# Create DESeq2 dataset
dds <- DESeqDataSetFromMatrix(countData = round(counts),
                              colData = metadata,
                              design = ~ condition)

# Store normalized counts (for future visualization purposes)
dds <- estimateSizeFactors(dds)
normalizedCounts <- counts(dds, normalized = TRUE)
# TODO: save the counts

# Run differential gene expression testing
dds <- DESeq(dds)
res <- results(dds, 
               contrast = c("condition", experimental, baseline),
               lfcThreshold = logFCThreshold, 
               alpha = alphaThreshold,
               pAdjustMethod = adjustMethod)
res <- as.data.frame(res)
res <- res %>%
  rownames_to_column(var = "gene")
# TODO: save the DE genes




