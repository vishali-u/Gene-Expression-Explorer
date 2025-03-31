// Interfaces to avoid type errors
 
export interface Gene {
    symbol: string;
    logFC: number;
    logCPM: number;
    F: number;
    PValue: number;
    FDR: number;
}