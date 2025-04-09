import { Gene } from "@/utils/types";

export default function prepareGraphData({ genes }: {genes: Gene[]}, 
    FCThreshold: number, sigThreshold: number) {

    const dataPoints = genes.map((gene) => {
        let color = "grey";

        if (gene.FDR <= sigThreshold) {
            if (gene.logFC > FCThreshold) {
                color = "blue"; // Significant upregulated genes
            } else if (gene.logFC < -FCThreshold) {
                color = "red"; // Significant downregulated genes
            }
        }

        return ({
            symbol: gene.symbol,
            negLogPVal: -Math.log10(gene.FDR), 
            logFC: gene.logFC,
            color: color,
            description: `${gene.symbol}<br>Adj. P-val: ${gene.FDR}<br>Log FC: ${gene.logFC}`
        });
    })

    return dataPoints;
}