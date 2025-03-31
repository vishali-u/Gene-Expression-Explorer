// Display differentially expressed genes in a table

import { useState, useEffect, useMemo } from "react";
import { Gene } from "@/utils/types"

export default function DEGeneTable({ refreshData }: { refreshData: boolean }) {
    const [ allGenes, setAllGenes ] = useState<Gene[]>([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ currentPage, setCurrentPage ] = useState(1);
    const genesPerPage = 17;

    // Fetch all DE genes
    const fetchGenes = async() => {
        const response = await fetch("/api/de-genes", { cache: "no-store" });
        const data = await response.json();
        setAllGenes(data);
    };

    useEffect(() => {
        fetchGenes();
    }, [refreshData]);
    

    // Filter genes (allow users to search by gene symbol)
    const filteredGenes = useMemo(() => {
        let filtered = allGenes
        if (searchTerm) {
            filtered = filtered.filter((gene) =>
                gene.symbol.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
        }

        return filtered; 
    }, [allGenes, searchTerm]);

    // Determine what genes to display based on page number
    const indexOfLastGene = currentPage * genesPerPage;
    const indexOfFirstGene = indexOfLastGene - genesPerPage;
    const currentGenes = filteredGenes.slice(indexOfFirstGene, indexOfLastGene);

    // Next page button click
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredGenes.length / genesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Previous page button click
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-black">Differentially Expressed Genes</h1>
    
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    id="gene-search"
                    type="text"
                    placeholder="Search gene symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
    
            {/* Gene Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg relative">
                <table id="de-gene-table" className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-black text-center">
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">Symbol</th>
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">LogFC</th>
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">LogCPM</th>
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">F</th>
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">PValue</th>
                            <th className="px-4 py-2 font-bold border-b border-r border-blue-300">FDR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentGenes.map((gene) => (
                            <tr key={gene.symbol} className="hover:bg-blue-50 text-center">
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.symbol}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.logFC}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.logCPM}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.F}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.PValue}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.FDR}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {/* Pagination Buttons */}
            <div className="flex justify-end space-x-2 mt-4">
                <button
                    id="prev-page"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-blue-200 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    id="next-page"
                    onClick={nextPage}
                    disabled={currentPage >= Math.ceil(filteredGenes.length / genesPerPage)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-blue-200 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}