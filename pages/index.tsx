import { useState, useEffect } from "react";
import { Gene } from "@/utils/types";
import FileUpload from "@/components/Input/FileUpload";
import DEGeneTable from "@/components/Tables/DEGeneTable";

export default function Home() {
    const [ allGenes, setAllGenes ] = useState<Gene []>([])
    const [refreshData, setRefreshData] = useState(false);

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
          {/* <h1 className="text-xl font-bold">Gene Expression Explorer</h1> */}
          <FileUpload onUpload={handleFileUploaded} />
          <DEGeneTable allGenes={allGenes} />
      </div>
    );
}
