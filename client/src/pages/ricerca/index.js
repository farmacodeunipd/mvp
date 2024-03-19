import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NoResults from "../../components/NoResults";
import Filter from "../../components/Filter";
import Results from "../../components/Results";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";
const algoUrl = process.env.ALGO_API_URL || "localhost:4000";

function Ricerca() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
    }, [navigate]);

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
            <div className="h-screen p-2 flex flex-col gap-2">
                <Header />
                <div className="h-full flex flex-col gap-2 rounded-3xl p-2 bg-white border border-gray-300">
                    <Filter
                        onFetchResults={fetchResults}
                        users={users}
                        items={items}
                        onObjectChange={handleObjectChange}
                    ></Filter>
                    {results === null && !loading ? (
                        <NoResults></NoResults>
                    ) : null}
                    {loading ? (
                        <p className="">Caricamento in corso...</p>
                    ) : (
                        results !== null && (
                            <Results
                                data={results}
                                selectObject={selectObject}
                            ></Results>
                        )
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Ricerca;
