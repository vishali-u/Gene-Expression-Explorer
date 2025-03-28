// File upload components
import { useState } from "react";
import { UploadCloud, X } from "lucide-react";

export default function FileUpload() {
    const [isOpen, setIsOpen] = useState(false);
    const [ file, setFile ] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // File change handler
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        
        const formData = new FormData();
        formData.append("file", file!);

        try {
            const response = await fetch("/api/upload", {
                method: "POST", 
                body: formData
            });

            // use the message returned by the API
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error uploading file.")
        }
    }

    // display
    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all duration-300 hover:rounded-lg hover:px-6"
            >
                <UploadCloud className="h-20 w-20" />
                <span className="hidden group-hover:block text-2xl font-semibold">Upload Dataset</span>
            </button>

            {/* File upload box */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Upload Your Dataset</h2>
                            <button onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            className="w-full p-2 border rounded mt-4"
                            onChange={handleFileChange}
                        />
                        {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
                    </div>
                </div>
            )}
        </div>
    )
}