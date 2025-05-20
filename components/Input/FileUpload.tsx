import { useState } from "react";
import { X } from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [countsFile, setCountsFile] = useState<File | null>(null);
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [baseline, setBaseline] = useState("");
  const [experimental, setExperimental] = useState("");
  const [minNumSamples, setMinNumSamples] = useState("3");
  const [minCounts, setMinCounts] = useState("10");
  const [adjustMethod, setAdjustMethod] = useState("BH");
  //const [alphaThreshold, setAlphaThreshold] = useState("0.05");
  //const [logFCThreshold, setLogFCThreshold] = useState("1");

  const handleCountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setCountsFile(e.target.files[0]);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMetadataFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!countsFile || !metadataFile) {
      setMessage("Please upload both counts and metadata files.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("counts", countsFile);
    formData.append("metadata", metadataFile);
    formData.append("baseline", baseline);
    formData.append("experimental", experimental);
    formData.append("minNumSamples", minNumSamples);
    formData.append("minCounts", minCounts);
    formData.append("adjustMethod", adjustMethod);
    //formData.append("alphaThreshold", alphaThreshold);
    //formData.append("logFCThreshold", logFCThreshold);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      setMessage(data.message);
      onUpload();
    } catch (error) {
      setLoading(false);
      setMessage("Upload failed.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 p-6 text-white shadow-lg transition-all duration-300 rounded-full hover:px-6"
      >
        <i className="fa fa-cloud-upload fa-3x"></i>
        <span className="text-2xl font-semibold ml-2 hidden group-hover:block">
          Upload Dataset
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[30rem] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Upload RNA-seq Data</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* File Inputs */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Counts File</label>
              <input
                type="file"
                accept=".csv,.tsv"
                onChange={handleCountsChange}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Metadata File</label>
              <input
                type="file"
                accept=".csv,.tsv"
                onChange={handleMetadataChange}
              />
            </div>

            {/* Parameter Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Baseline Group</label>
                <input
                  type="text"
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Experimental Group</label>
                <input
                  type="text"
                  value={experimental}
                  onChange={(e) => setExperimental(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Min Samples</label>
                <input
                  type="number"
                  value={minNumSamples}
                  onChange={(e) => setMinNumSamples(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Min Counts</label>
                <input
                  type="number"
                  value={minCounts}
                  onChange={(e) => setMinCounts(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Adjust Method</label>
                <input
                  type="text"
                  value={adjustMethod}
                  onChange={(e) => setAdjustMethod(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>
              {/*<div>
                <label className="block text-sm font-medium">Alpha Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  value={alphaThreshold}
                  onChange={(e) => setAlphaThreshold(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>*/}
              {/*<div>
                <label className="block text-sm font-medium">logFC Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  value={logFCThreshold}
                  onChange={(e) => setLogFCThreshold(e.target.value)}
                  className="w-full border rounded p-1"
                />
              </div>*/}
            </div>

            <button
              onClick={handleFileUpload}
              className="w-full bg-blue-600 text-white p-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Run DESeq2"}
            </button>

            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
