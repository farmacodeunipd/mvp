import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';

const searchObject = [
    { id: 1, name: "Seleziona topic...", valore: "null", unavailable: true },
    { id: 2, name: "Clienti", valore: "user", unavailable: false },
    { id: 3, name: "Prodotti", valore: "item", unavailable: false },
];

const tops = [
    { id: 1, name: "Seleziona N...", valore: "null", unavailable: true },
    { id: 2, name: "Top 5", valore: "5", unavailable: false },
    { id: 3, name: "Top 10", valore: "10", unavailable: false },
    { id: 4, name: "Top 20", valore: "20", unavailable: false },
];

function Filter({ onFetchResults, users, items, onObjectChange }) {
    const [selectedSearchObject, setSelectedSearchObject] = useState(searchObject[0]);
    const [selectedUser, setSelectedUser] = useState();
    useEffect(() => {
        setSelectedUser(users[0]);
    }, [users]);
    const [selectedItem, setSelectedItem] = useState();
    useEffect(() => {
        setSelectedItem(items[0]);
    }, [items]);
    const [query, setQuery] = useState("");
    const [selectedTop, setSelectedTop] = useState(tops[0]);

    const handleObjectChange = (e) => {
        setSelectedSearchObject(e.value);
        onObjectChange(e.value);
    };

    return (
        <>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-3xl shadow-lg">
                <form className="flex flex-col justify-center md:flex-row md:justify-around md:items-center space-y-2 md:space-y-0" method="post">
                    {/* PRIMO FILTRO */}
                    <div className="w-48 mx-auto">
                        <Dropdown 
                            value={selectedSearchObject} 
                            onChange={(e) => {
                                handleObjectChange(e);
                            }}
                            options={searchObject} 
                            placeholder="Seleziona topic..." 
                            optionLabel="name" 
                            className="relative w-full rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white py-2 pl-3 pr-10 text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm"
                            panelClassName="z-30 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar"
                        />
                    </div>
                    {/* FILTRO CLIENTI o PRODOTTI */}
                    {selectedSearchObject.id !== 1 && (
                        <div className="w-48 lg:w-96 xl:w-[35rem] mx-auto">
                            <Dropdown 
                                value={selectedSearchObject.id === 2 ? selectedUser : selectedItem} 
                                onChange={(e) => {
                                    selectedSearchObject.id === 2 ? setSelectedUser(e.value) : setSelectedItem(e.value);
                                }}
                                options={selectedSearchObject.id === 2 ? users : items} 
                                optionLabel={selectedSearchObject.id === 2 ? "rag_soc" : "des_art"} 
                                placeholder={selectedSearchObject.id === 2 ? "Seleziona cliente..." : "Seleziona prodotto..."} 
                                disabled={selectedSearchObject.id === 1} 
                                className="relative w-full cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white py-2 pl-3 pr-10 text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm"
                            />
                        </div>
                    )}
                    {/* FILTRO TOP_N */}
                    <div className="w-48 mx-auto">
                        <Dropdown 
                            value={selectedTop} 
                            onChange={(e) => setSelectedTop(e.value)} 
                            options={tops} 
                            placeholder="Seleziona N..." 
                            optionLabel="name" 
                            className="w-full"
                        />
                    </div>
                    {/* BOTTONE INVIO */}
                    <div className="mx-auto">
                        <button
                            type="button"
                            disabled={selectedSearchObject.id === 1 || selectedTop.id === 1}
                            className={`py-2 px-6 rounded-lg text-white font-bold cursor-pointer shadow-lg focus:outline-none ${
                                selectedSearchObject.id === 1 || selectedTop.id === 1
                                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                            onClick={() => {
                                const id = selectedSearchObject.id === 2 ? selectedUser.cod_cli : selectedItem.cod_art;
                                onFetchResults(selectedSearchObject.valore, id, selectedTop.valore);
                            }}
                        >
                            Ricerca
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Filter;
