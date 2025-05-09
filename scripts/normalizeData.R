# Normalize RNA-seq data for further analysis

# Load required libraries
suppressMessages(library(DESeq2))
suppressMessages(library(tidyverse))

# Parse data
args <- commandArgs(trailingOnly = TRUE)
countsPath <- args[1]
metadataPath <- args[2]

# Load data
counts <- read.csv(countsPath)
metadata <- read.csv(metadataPath)

row.names(counts) <- counts$GeneName

# TODO: add error checking to make sure metadata row names and counts
# column names match

# Create DESeq2 dataset (no differential expression testing)
dds <- DESeqDataSetFromMatrix(countData = counts,
                              colData = metadata,
                              design = ~ 1)




