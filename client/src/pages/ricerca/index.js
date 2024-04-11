import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NoResults from "../../components/NoResults";
import Filter from "../../components/Filter";
import Results from "../../components/Results";
import { Dialog } from "primereact/dialog"

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
    const [idRic, setIdRic] = useState(null);
    const [algoType, setAlgoType] = useState(null);
    const [showTrainingDialog, setShowTrainingDialog] = useState(false);

    function handleObjectChange(type) {
        setSelectedObject(type);
        setResults(null);
    }

    const renderTrainingDialog = (algo) => {
        return (
            <Dialog
                pt={ptDialog}
                style={{ width: '450px' }}
                header={'Warning:'}
                modal
                visible={showTrainingDialog}
                onHide={() => setShowTrainingDialog(false)}
            >
                <p className="m-0">
                L&apos;algoritmo selezionato, {algo}, è attualmente in training, si prega di attendere fino a che il processo non venga completato o di cambiare algoritmo di ricerca.
                </p>
            </Dialog>
        );
    };

    async function fetchResults(algo, object, id, n) {
        setLoading(true);
        const response = await axios.get(
            `http://${algoUrl}/search/${algo}/${object}/${id}/${n}`
        );
        console.log("Risposta:", response.data);

        if (response.data.message === 'Training in progress. Please wait a few minutes and try again later.') {
            setAlgoType(algo);
            setShowTrainingDialog(true);
            setLoading(false);
            return; // Exit fetchResults function
        }
        setIdRic(id.toString());
        setAlgoType(algo);
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

    const ptDialog = {
        root: {
            className: "!rounded-3xl",
        },
        header: {
            className: "!p-6 !rounded-t-3xl",
        },
        closeButton: {
            className: "!w-8 !h-8",
        },
        closeButtonIcon: {
            className: "!w-4 !h-4",
        },
        content: {
            className: "!px-6 !pb-8 !rounded-b-3xl",
        },
    };

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
                    {renderTrainingDialog(algoType)}
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
                                idRic={idRic}
                                algoType={algoType}
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
