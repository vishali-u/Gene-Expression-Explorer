# Run differential gene expression analysis for the given RNA-seq data

######## Load required libraries ######## 
suppressMessages(library(DESeq2))
suppressMessages(library(dplyr))
suppressMessages(library(tidyverse))


######## Function ######## 
runDGE <- function(countsPath,
                   metadataPath,
                   baseline,
                   experimental,
                   minNumSamples,
                   minCounts,
                   adjustMethod,
                   alphaThreshold,
                   logFCThreshold,
                   outputDir) {
  
  ######## Convert strings to numbers ########
  minNumSamples <- as.integer(minNumSamples)
  minCounts <- as.integer(minCounts)
  alphaThreshold <- as.numeric(alphaThreshold)
  logFCThreshold <- as.numeric(logFCThreshold)
  
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
  
  # Convert to dataframe and save
  normalizedCounts <- as.data.frame(normalizedCounts)
  normalizedCounts <- normalizedCounts %>%
    rownames_to_column(var = "gene")
  
  write.csv(normalizedCounts, 
            file = file.path(outputDir, "normalized_counts.csv"), 
            row.names = FALSE)
  
  
  # Run differential gene expression testing
  dds <- DESeq(dds)
  res <- results(dds, 
                 contrast = c("condition", experimental, baseline),
                 lfcThreshold = logFCThreshold, 
                 alpha = alphaThreshold,
                 pAdjustMethod = adjustMethod)
  
  # Convert to dataframe and save
  res <- as.data.frame(res)
  res <- res %>%
    rownames_to_column(var = "gene")
  
  write.csv(res, 
            file = file.path(outputDir, "de_results.csv"), 
            row.names = FALSE)
}