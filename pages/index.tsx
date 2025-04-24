import { useState, useEffect } from "react";
import { Gene } from "@/utils/types";
import FileUpload from "@/components/Input/FileUpload";
import DEGeneTable from "@/components/Tables/DEGeneTable";
//import VolcanoPlot from "@/components/Plots/VolcanoPlot";
import dynamic from "next/dynamic";

// Dynamically import VolcanoPlot with no SSR (server-side rendering)
const VolcanoPlot = dynamic(() => import("@/components/Plots/VolcanoPlot"), { 
    ssr: false 
});

export default function Home() {
    const [ allGenes, setAllGenes ] = useState<Gene []>([]);
    const [ refreshData, setRefreshData ] = useState(false);
    const [ view, setView ] = useState<"table" | "plot">("table");
    const [ FCThreshold, setFcThreshold ] = useState(0.5);
    const [ sigThreshold, setSigThreshold ] = useState(0.05);

    // Fetch all DE genes
    const fetchGenes = async() => {
        const response = await fetch("/api/de-genes");
        const data = await response.json();
        setAllGenes(data);
    };

    useEffect(() => {
        fetchGenes();
    }, [refreshData]);


    // Function to trigger a re-fetch
    const handleFileUploaded = () => {
        setRefreshData(prev => !prev);
    };

    return (
        <div className="container mx-auto p-8">
            <FileUpload onUpload={handleFileUploaded} />

            {/* Threshold Input Section */}
            {view === "plot" && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <label htmlFor="FCThreshold" className="mr-2 font-bold">
                            Log Fold Change Threshold:
                        </label>
                        <input
                            id="FCThreshold"
                            type="number"
                            value={FCThreshold}
                            onChange={(e) => setFcThreshold(parseFloat(e.target.value))}
                            min="0"
                            step="0.1"
                            className="px-2 py-1 border rounded"
                        />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="sigThreshold" className="mr-2 font-bold">
                            Significance Threshold:
                        </label>
                        <input
                            id="sigThreshold"
                            type="number"
                            value={sigThreshold}
                            onChange={(e) => setSigThreshold(parseFloat(e.target.value))}
                            min="0"
                            max="1"
                            step="0.01"
                            className="px-2 py-1 border rounded"
                        />
                    </div>
                </div>
            )}

            {/* Floating Plot/Table Button */}
            <button
                onClick={() => setView(view === "table" ? "plot" : "table")}
                className="fixed bottom-6 left-6 flex items-center gap-2 bg-blue-600 p-6 text-white shadow-lg transition-all duration-300 rounded-full hover:px-6"
            >
                <span className="text-2xl font-semibold">
                    {view === "table" ? "Plot" : "Table"}
                </span>
            </button>

            {/* Display */}
            {view === "table" ? (
                <DEGeneTable allGenes={allGenes} />
            ) : (
                <VolcanoPlot genes={allGenes} thresholds={{ FCThreshold, sigThreshold }} />
            )}
        </div>
    );
}

