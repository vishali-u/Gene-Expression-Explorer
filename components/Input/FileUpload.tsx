// File upload components
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [ message, setMessage ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState(false);

    // File change handler
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(null);
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }

    // File upload handler
    const handleFileUpload = async () => {
        if (!file) {
            setMessage("Please upload a file.");
            return;
        }

        setLoading(true);
        
        const formData = new FormData();
        formData.append("file", file!);

        try {
            const response = await fetch("/api/upload", {
                method: "POST", 
                body: formData
            });

            // use the message returned by the API
            const data = await response.json();
            setLoading(false);
            setMessage("File uploaded successfully!");
            onUpload();
        } catch (error) {
            setLoading(false);
            setMessage("Error uploading file.")
        }
    }

    // display
    return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Upload Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 p-6 text-white shadow-lg transition-all duration-300 rounded-full hover:px-6"
      >
        <i className="fa fa-cloud-upload fa-3x"></i>
        <span className="text-2xl font-semibold ml-2 hidden group-hover:block">
          Upload Dataset
        </span>
      </button>

      {/* File Upload Box */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upload Your Dataset</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drop Zone (Clickable Label for File Input) */}
            <label
              className="mt-4 border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer block hover:border-blue-500"
            >
              {file ? (
                <p className="text-gray-700">
                    {file.name}
                    <br />
                    <span className="italic text-xs">(Click to change file.)</span>
                </p>
              ) : (
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".csv, .tsv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Upload Button */}
            <button
              onClick={handleFileUpload}
              className="w-full mt-4 bg-blue-600 text-white p-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            {/* Upload Message */}
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}