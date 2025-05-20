import { DEGene } from "@/utils/types";

export default function prepareGraphData({ genes }: {genes: DEGene[]}, 
    FCThreshold: number, sigThreshold: number) {

    const dataPoints = genes.map((gene) => {
        let color = "grey";

        if (gene.PAdj <= sigThreshold) {
            if (gene.Log2FC > FCThreshold) {
                color = "blue"; // Significant upregulated genes
            } else if (gene.Log2FC < -FCThreshold) {
                color = "red"; // Significant downregulated genes
            }
        }

        return ({
            symbol: gene.Symbol,
            negLogPVal: -Math.log10(gene.PAdj), 
            logFC: gene.Log2FC,
            color: color,
            description: `${gene.Symbol}<br>Adj. P-val: ${gene.PAdj}<br>Log FC: ${gene.Log2FC}`
        });
    })

    return dataPoints;
}