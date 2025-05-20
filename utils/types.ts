import { output } from "motion/react-client";

export interface DEGene {
    Symbol: string,
    BaseMean: number,
    Log2FC: number,
    SELog2FC: number,
    TestStat: number,
    PValue: number,
    PAdj: number
}

export interface DataPoint {
    symbol: string, 
    negLogPVal: number,
    logFC: number,
    color: string,
    description: string
}

export interface DESeq2Params {
  countsPath: string;
  metadataPath: string;
  baseline: string;
  experimental: string;
  minNumSamples: number;
  minCounts: number;
  adjustMethod: string;
  alphaThreshold: number;
  logFCThreshold: number;
  outputDir: string;
}