import { useState } from "react";
import FileUpload from "@/components/Input/FileUpload";
import DEGeneTable from "@/components/Tables/DEGeneTable";

export default function Home() {
    const [refreshData, setRefreshData] = useState(false);

    // Function to trigger a re-fetch
    const handleFileUploaded = () => {
        setRefreshData(prev => !prev);
    };

    return (
      <div className="container mx-auto p-8">
          {/* <h1 className="text-xl font-bold">Gene Expression Explorer</h1> */}
          <FileUpload onUpload={handleFileUploaded} />
          <DEGeneTable refreshData={refreshData} />
      </div>
    );
}
