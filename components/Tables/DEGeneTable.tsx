// Display differentially expressed genes in a table

import { useState, useEffect, useMemo } from "react";
import { DEGene } from "@/utils/types";

export default function DEGeneTable({ allGenes }: { allGenes: DEGene[] }) {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ currentPage, setCurrentPage ] = useState(1);
    const [sortKey, setSortKey] = useState<keyof DEGene | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const genesPerPage = 17;

    // Filter and sort genes
    // allow users to search by gene symbol (TODO: more filtering options?)
    const filteredGenes = useMemo(() => {
        let filtered = allGenes;
        if (searchTerm) {
            filtered = filtered.filter((gene) =>
                gene.Symbol.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
        }
        
        // Sorting 
        if (sortKey) {
            filtered.sort((a, b) => {
                const valueA = a[sortKey];
                const valueB = b[sortKey];

                const sortMultiplier = (sortOrder === "asc" ? 1 : -1);

                if (typeof valueA === "string" && typeof valueB === "string") {
                    return valueA.localeCompare(valueB) * sortMultiplier;
                } else {
                    return ((valueA as number) - (valueB as number)) * sortMultiplier;
                }
            });
        }

        return filtered;
    }, [allGenes, searchTerm, sortKey, sortOrder]);

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

    const handleSort = (column: keyof DEGene) => {
        if (sortKey === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(column);
            setSortOrder("asc");
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-black">Differentially Expressed Genes</h1>

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

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg relative">
                <table id="de-gene-table" className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-black text-center">
                            {["Symbol", "BaseMean", "Log2FC", "SELog2FC", "TestStat", "PValue", "PAdj"].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-2 font-bold border-b border-r border-blue-300 cursor-pointer"
                                    onClick={() => handleSort(col as keyof DEGene)}
                                >
                                    <span className="mr-2">{col}</span>
                                    <span className="text-gray-400 ml-2">
                                        {sortKey === col ? (
                                            sortOrder === "asc" ? "↑" : "↓"
                                        ) : (
                                            "↑↓"
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentGenes.map((gene) => (
                            <tr key={gene.Symbol} className="hover:bg-blue-50 text-center">
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.Symbol}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.BaseMean}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.Log2FC}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.SELog2FC}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.TestStat}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.PValue}</td>
                                <td className="px-4 py-2 text-black border-b border-r border-blue-200">{gene.PAdj}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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