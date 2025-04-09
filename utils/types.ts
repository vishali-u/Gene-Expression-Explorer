export interface Gene {
    symbol: string,
    logFC: number,
    logCPM: number,
    F: number,
    PValue: number,
    FDR: number
}

export interface DataPoint {
    symbol: string, 
    negLogPVal: number,
    logFC: number,
    color: string,
    description: string
}