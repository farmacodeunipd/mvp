import { React, useState, useEffect } from "react";
import Filter from "./Filter";
import axios from "axios";
import NoResults from "./NoResults";
import Results from "./Results";

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';
const algoUrl = process.env.ALGO_API_URL || 'localhost:4000';

function SearchView() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectObject, setSelectedObject] = useState("user");

    function handleObjectChange(type) {
        setSelectedObject(type);
        setResults(null);
    }

    async function fetchResults(object, id, n) {
        setLoading(true);
        const response = await axios.get(
            `http://${algoUrl}/search/${object}/${id}/${n}`
        );
        console.log("Risposta:", response.data);
        setResults(response.data);
        setLoading(false);
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers() {
        const response = await axios.get(`http://${expressUrl}/users`);
        setUsers(response.data);
    }

    const [items, setItems] = useState([]);
    useEffect(() => {
        getItems();
    }, []);

    async function getItems() {
        const response = await axios.get(`http://${expressUrl}/items`);
        setItems(response.data);
    }

    return (
        <>
            <div className="p-4 space-y-4 bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg flex flex-col h-full overflow-hidden">
                <Filter
                    onFetchResults={fetchResults}
                    users={users}
                    items={items}
                    onObjectChange={handleObjectChange}
                ></Filter>
                {results === null && !loading ? <NoResults></NoResults> : null}
                {loading ? (
                    <p className="dark:text-white">Caricamento in corso...</p>
                ) : (
                    results !== null && (
                        <Results
                            data={results}
                            selectObject={selectObject}
                        ></Results>
                    )
                )}
            </div>
        </>
    );
}

export default SearchView;
