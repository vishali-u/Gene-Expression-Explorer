import Plot from "react-plotly.js";
import prepareDataPoints from "@/utils/volcanoPlotUtils";
import { Gene } from "@/utils/types";
import { Layout, PlotData } from "plotly.js";

export default function VolcanoPlot({ genes, thresholds }: { genes: Gene[], 
    thresholds: { FCThreshold: number, sigThreshold: number } }) {

    const { FCThreshold, sigThreshold } = thresholds;
    const dataPoints = prepareDataPoints({ genes }, FCThreshold, sigThreshold);

    // Separate data by category for legend + color grouping
    const categories = {
        upregulated: {
            name: "Upregulated",
            color: "blue",
            points: dataPoints.filter(p => p.color === "blue")
        },
        downregulated: {
            name: "Downregulated",
            color: "red",
            points: dataPoints.filter(p => p.color === "red")
        },
        nonsignificant: {
            name: "Non-significant",
            color: "grey",
            points: dataPoints.filter(p => p.color === "grey")
        }
    };

    // Specify the data for the graph
    const traces: Partial<PlotData>[] = Object.values(categories).map(category => ({
        x: category.points.map(p => p.logFC),
        y: category.points.map(p => p.negLogPVal),
        text: category.points.map(p => p.description),
        name: category.name,
        mode: "markers",
        type: "scatter",
        marker: {
            color: category.color,
            size: 8,
        },
        hoverinfo: "text",
    }));
    
    // Define the titles and legend
    const layout: Partial<Layout> = {
        autosize: true,
        title: {
            text: "Differentially Expressed Genes",
            font: {
                size: 25,
                family: "Arial, sans-serif", 
                weight: 1000,
                color: "black"
            },
            x:0,
            xanchor: "left",
            yanchor: "top",
            y: 1.05
        },
        xaxis: {
            title: {
                text: "Log2 Fold Change",
                font: {
                    size: 18,
                    family: "Arial, sans-serif", 
                    weight: 1000, 
                    color: "black"
                },
            },
        },
        yaxis: {
            title: {
                text: "-Log10 Adjusted P-Value", 
                font: {
                    size: 18,
                    family: "Arial, sans-serif", 
                    weight: 1000, 
                    color: "black"
                },
            },
        },
        hovermode: "closest",
        dragmode: false,
        legend: {
          x: 1,
          y: 1,
          bgcolor: "rgba(255,255,255,0.5)",
          borderwidth: 1,
        },
      };

    return (
        <div className="w-full h-[800px]">
            <Plot
                data={traces}
                layout={{ ...layout, autosize: true }}
                style={{ width: "100%", height: "100%" }}
                config={{ responsive: true }}
            />
        </div>
    );
}
