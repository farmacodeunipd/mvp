import React, { useState, useEffect } from "react";
import axios from "axios";

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';

async function getItem(id) {
    const response = await axios.get(`http://${expressUrl}/items/${id}`);
    return response.data[0].des_art;
}

function CatProd() {
    const [results, setResults] = useState([]);
    const [names, setNames] = useState([]);
    const [error, setError] = useState(null); // Aggiungi uno stato per gestire gli errori

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${expressUrl}/items`);
                setResults(response.data); // Assegna i dati dei prodotti a results

                // Ottieni i nomi dei prodotti
                const promises = response.data.map(async (item) => {
                    return await getItem(item.id);
                });
                const resolvedNames = await Promise.all(promises);
                setNames(resolvedNames);
            } catch (error) {
                console.error("Errore durante la chiamata API:", error);
                setError("Si è verificato un errore durante il recupero dei dati.");
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {error && <div>Errore: {error}</div>} {/* Visualizza l'errore se è stato impostato */}
            <div className="overflow-y-auto custom-scrollbar shadow-lg ring-1 ring-black ring-opacity-5 md:mx-0 rounded-3xl">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-950">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 dark:text-white sm:pl-6">
                                Id
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900 dark:text-white">
                                Nome
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-900 bg-white dark:bg-gray-600">
                        {results.map((result, index) => (
                            <tr key={result.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                    {result.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500  dark:text-gray-200">
                                    {index < names.length ? (names[index] || "Non trovato") : "Indice non valido"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default CatProd;
