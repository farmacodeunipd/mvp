import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";
const algoUrl = process.env.ALGO_API_URL || "localhost:4000";

const searchObject = [
    { name: "Clienti", value: "user" },
    { name: "Prodotti", value: "item" },
];

const algo = [
    { name: "SVD", value: "SVD" },
    { name: "NN", value: "NN" },
];

const tops = [
    { name: "Top 5", value: "5" },
    { name: "Top 10", value: "10" },
    { name: "Top 20", value: "20" },
];

function Filter({ onFetchResults, users, items, onObjectChange }) {
    const [selectedSearchObject, setSelectedSearchObject] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedTop, setSelectedTop] = useState(null);
    const [selectedAlgo, setSelectedAlgo] = useState(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [loadingTraining, setLoadingTraining] = useState(false);

    const user = sessionStorage.getItem("username");
    const amministratore = sessionStorage.getItem("amministratore");

    function proceedFetch(e) {
        e.preventDefault();
        const id =
            selectedSearchObject === "user"
                ? selectedUser.cod_cli
                : selectedItem.cod_art;
        onFetchResults(selectedAlgo, selectedSearchObject, id, selectedTop);

        const algo = selectedAlgo;
        const topic = selectedSearchObject;
        const cod_ric = id;
        const top_sel = selectedTop;

        axios
            .put(`http://${expressUrl}/cronologia/new`, {
                user,
                algo,
                topic,
                cod_ric,
                top_sel,
            })
            .catch((error) => console.error("Errore nell'inserimento", error));
    }

    const renderProductDialog = (algo) => {
        return (
            <Dialog
                pt={ptDialog}
                visible={showProductDialog}
                style={{ width: "450px" }}
                header={loadingTraining ? "Loading" : "Warning"}
                modal
                onHide={() => setShowProductDialog(false)}
                data-testid="dialog"
            >
                <div className="flex flex-column">
                    {loadingTraining ? (
                        <div className="flex flex-column">
                            <div style={{ marginBottom: "20px" }}>
                                <ProgressBar
                                    mode="indeterminate"
                                    style={{ height: "6px" }}
                                ></ProgressBar>
                            </div>
                            <p className="m-0"> Training ...</p>
                        </div>
                    ) : (
                        <div className="flex flex-column">
                            <div style={{ marginBottom: "20px" }}>
                                <p className="m-0">
                                    Sicuro di voler avviare un training per
                                    l&apos;algoritmo {algo}? Il processo
                                    potrebbe richiedere alcuni minuti.
                                </p>
                            </div>
                            <Button // Display the confirmation button when not loading
                                pt={ptButton}
                                label="Conferma"
                                icon="pi pi-check"
                                onClick={async () => {
                                    setLoadingTraining(true); // Set loading to true when button clicked
                                    const response = await axios.get(
                                        `http://${algoUrl}/train/${algo}`
                                    );
                                    console.log("Risposta:", response.data);
                                    setLoadingTraining(false); // Set loading to false when training complete
                                    setShowProductDialog(false);
                                }}
                                data-testid="confirm-training-button"
                            />
                        </div>
                    )}
                </div>
            </Dialog>
        );
    };

    const selectedUserItemTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>
                        {selectedSearchObject === "user"
                            ? option.rag_soc
                            : option.des_art}
                    </div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const userItemOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>
                    {selectedSearchObject === "user"
                        ? option.rag_soc
                        : option.des_art}
                </div>
            </div>
        );
    };

    const isTrainButtonDisabled = () => {
        if (!selectedAlgo) {
            return true;
        }
        return false;
    };

    const isSearchButtonDisabled = () => {
        if (!selectedSearchObject || !selectedTop || !selectedAlgo) {
            return true;
        }
        if (selectedSearchObject === "user") {
            return selectedUser === null;
        }
        if (selectedSearchObject === "item") {
            return selectedItem === null;
        }
        return true;
    };

    const ptDialog = {
        root: {
            className: "!rounded-3xl",
        },
        header: {
            className: "!p-6 !rounded-t-3xl",
        },
        closeButton: {
            className: "!w-8 !h-8",
            disabled: loadingTraining,
        },
        closeButtonIcon: {
            className: "!w-4 !h-4",
        },
        content: {
            className: "!px-6 !pb-8 !rounded-b-3xl",
        },
    };

    const ptDropdown = {
        input: {
            className: "!p-2 !duration-0",
        },
        trigger: {
            className: "!w-12",
        },
        panel: {
            className: "!duration-0 !transition-none",
        },
        list: {
            className: "!py-1",
        },
        item: {
            className: "!p-2",
        },
        header: {
            className: "!p-2",
        },
        filterInput: {
            className: "!pl-8 !pr-2 !py-2",
        },
        filterIcon: {
            className: "!mx-2",
        },
    };

    const ptButton = {
        root: {
            className: "!py-2 !px-4",
        },
    };

    return (
        <>
            <div
                className="p-2 bg-gray-200 rounded-3xl border border-gray-300"
                data-testid="filter"
            >
                <div className="flex">
                    <form
                        className="flex flex-grow justify-center md:flex-row md:justify-around md:items-center space-x-2"
                        onSubmit={proceedFetch}
                    >
                        <div className="flex-grow">
                            <Dropdown
                                value={selectedAlgo}
                                onChange={(e) => setSelectedAlgo(e.value)}
                                options={algo}
                                optionLabel="name"
                                placeholder="Seleziona algoritmo"
                                className="w-full md:!w-40 !duration-0"
                                pt={ptDropdown}
                                data-testid="algo"
                            />
                        </div>
                        <div className="flex-grow mx-0">
                            {amministratore == "1" && (
                                <Button
                                    label="Training"
                                    pt={ptButton}
                                    onClick={() => {
                                        setShowProductDialog(true);
                                    }}
                                    type="button"
                                    disabled={isTrainButtonDisabled()}
                                    data-testid="training-button"
                                />
                            )}

                            {renderProductDialog(selectedAlgo)}
                        </div>
                        <div className="flex-grow">
                            <Dropdown
                                value={selectedSearchObject}
                                onChange={(e) => {
                                    setSelectedSearchObject(e.value);
                                    onObjectChange(e.value);
                                }}
                                options={searchObject}
                                optionLabel="name"
                                placeholder="Seleziona topic"
                                className="w-full md:!w-44 !duration-0"
                                pt={ptDropdown}
                                data-testid="topic"
                            />
                        </div>
                        <div className="flex-grow">
                            {selectedSearchObject ? (
                                <Dropdown
                                    value={
                                        selectedSearchObject === "user"
                                            ? selectedUser
                                            : selectedItem
                                    }
                                    onChange={(e) =>
                                        selectedSearchObject === "user"
                                            ? setSelectedUser(e.value)
                                            : setSelectedItem(e.value)
                                    }
                                    options={
                                        selectedSearchObject === "user"
                                            ? users
                                            : items
                                    }
                                    optionLabel={
                                        selectedSearchObject === "user"
                                            ? "rag_soc"
                                            : "des_art"
                                    }
                                    placeholder={
                                        selectedSearchObject === "user"
                                            ? "Seleziona un cliente"
                                            : "Seleziona un prodotto"
                                    }
                                    filter
                                    pt={ptDropdown}
                                    valueTemplate={selectedUserItemTemplate}
                                    itemTemplate={userItemOptionTemplate}
                                    className={`w-full ${
                                        selectedSearchObject === "user"
                                            ? "md:!w-96"
                                            : "md:!w-96"
                                    }`}
                                    data-testid="users-items"
                                />
                            ) : null}
                        </div>
                        <div className="flex-grow">
                            <Dropdown
                                value={selectedTop}
                                onChange={(e) => setSelectedTop(e.value)}
                                options={tops}
                                optionLabel="name"
                                placeholder="Seleziona N"
                                className="w-full md:!w-40 !duration-0"
                                pt={ptDropdown}
                                data-testid="top"
                            />
                        </div>
                        <div className="flex-grow">
                            <Button
                                label="Ricerca"
                                pt={ptButton}
                                disabled={isSearchButtonDisabled()}
                                data-testid="ricerca-button"
                            ></Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Filter.propTypes = {
    onFetchResults: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    onObjectChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default Filter;
