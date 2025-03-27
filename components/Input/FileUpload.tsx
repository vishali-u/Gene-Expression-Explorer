// File upload component
import { useState } from "react";

export default function FileUpload() {
    const [ file, setFile ] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // File change handler
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }

    // File upload handler
    const handleUpload = async () => {
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
            })

            // use the message returned by the API
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error uploading file.")
        }
    }

    // display
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <input type="file" accept=".csv, .tsv" onChange={handleChange}/>
            <button 
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                onClick={handleUpload} 
            >
                Upload
            </button>
            <p className="mt-2 text-red-500">{message}</p>
        </div>
    )
}