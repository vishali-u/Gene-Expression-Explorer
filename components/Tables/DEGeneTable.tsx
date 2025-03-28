// Display differentially expressed genes in a table

import { useState, useEffect, useMemo } from "react";

// A gene interface  (to prevent type errors)
interface Gene {
    symbol: string,
    logFC: number,
    logCPM: number, 
    F: number,
    PValue: number,
    FDR: number
}

export default function DEGeneTable() {
    const [ allGenes, setAllGenes ] = useState<Gene[]>([]);
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ currentPage, setCurrentPage ] = useState(1);
    const genesPerPage = 10;

    // fetch all DE genes
    const fetchGenes = async() => {
        const response = await fetch("/api/de-genes");
        const data = await response.json();
        setAllGenes(data);
    };

    useEffect(() => {
        fetchGenes();
    }, []);

    // allow users to search by gene symbol
    const filteredGenes = useMemo(() => {
        let filtered = allGenes
        if (searchTerm) {
            filtered = filtered.filter((gene) =>
                gene.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered; 
    }, [allGenes, searchTerm]);

    // determine what genes to display based on page number
    const indexOfLastGene = currentPage * genesPerPage;
    const indexOfFirstGene = indexOfLastGene - genesPerPage;
    const currentGenes = filteredGenes.slice(indexOfFirstGene, indexOfLastGene);

    // next page button click
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredGenes.length / genesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // previous page button click
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h1>Differentially Expressed Genes</h1>
            {/* Search Bar */}
            <input
                id="gene-search"
                type="text"
                placeholder="Search gene symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <br></br>

            {/* Gene Table */}
            <table id="de-gene-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>LogFC</th>
                        <th>LogCPM</th>
                        <th>F</th>
                        <th>PValue</th>
                        <th>FDR</th>
                    </tr>
                </thead>
                <tbody>
                    {currentGenes.map((gene) => (
                        <tr key={gene.symbol}>
                            <td>{gene.symbol}</td>
                            <td>{gene.logFC}</td>
                            <td>{gene.logCPM}</td> 
                            <td>{gene.F}</td>
                            <td>{gene.PValue}</td>
                            <td>{gene.FDR}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Buttons */}
            <div className="pagination-buttons">
                <button
                    id="prev-page"
                    onClick={prevPage}
                    disabled={currentPage===1}
                >
                    Previous
                </button>
                <button
                    id="next-page"
                    onClick={nextPage}
                    disabled={currentPage >= Math.ceil(filteredGenes.length / genesPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    )
}