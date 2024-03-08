import { React, useState, useEffect } from "react";
import { Listbox, Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

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
    const [selectedSearchObject, setSelectedSearchObject] = useState(
        searchObject[0]
    );
    const [selectedUser, setSelectedUser] = useState();
    useEffect(() => {
        // if (users.length > 0) {
        //     setSelectedUser(users[0]);
        // }
        setSelectedUser(users[0]);
    }, [users]);
    const [selectedItem, setSelectedItem] = useState();
    useEffect(() => {
        // if (items.length > 0) {
        //     setSelectedItem(items[0]);
        // }
        setSelectedItem(items[0]);
    }, [items]);
    const [query, setQuery] = useState("");
    const [selectedTop, setSelectedTop] = useState(tops[0]);

    const filteredUsers =
        query === ""
            ? users
            : users.filter((user) =>
                  user.rag_soc
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) =>
                  item.des_art
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    var disabilitato =
        selectedSearchObject.id === 1 || selectedTop.id === 1 ? true : false;

    return (
        <>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-3xl shadow-lg">
                <form
                    className="flex flex-col justify-center md:flex-row md:justify-around md:items-center space-y-2 md:space-y-0"
                    method="post"
                >
                    <div className="w-48 mx-auto">
                        <Listbox
                            value={selectedSearchObject}
                            onChange={(e) => {
                                setSelectedSearchObject(e);
                                onObjectChange(e);
                            }}
                            name="searchObject"
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white py-2 pl-3 pr-10 text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm">
                                    <span className="block truncate">
                                        {selectedSearchObject.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400 dark-text-gray-300"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="z-30 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar">
                                    {searchObject.map((searchObject) => (
                                        <Listbox.Option
                                            key={searchObject.id}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                                                        : "text-gray-900 dark:text-white"
                                                } ${
                                                    searchObject.unavailable
                                                        ? "opacity-50"
                                                        : ""
                                                }`
                                            }
                                            value={searchObject}
                                            disabled={searchObject.unavailable}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {searchObject.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600 dark:text-green-300">
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>
                    {selectedSearchObject.id === 1 ? null : (
                        <div className="w-48 lg:w-96 xl:w-[35rem] mx-auto">
                            {selectedSearchObject.id === 2 ? (
                                <Combobox
                                    value={selectedUser}
                                    onChange={setSelectedUser}
                                    name="user"
                                    disabled={
                                        selectedSearchObject.id === 1
                                            ? true
                                            : false
                                    }
                                    className={
                                        selectedSearchObject.id === 1
                                            ? "opacity-50"
                                            : ""
                                    }
                                >
                                    <div className="relative">
                                        <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                                                displayValue={(user) =>
                                                    user.rag_soc
                                                }
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </Combobox.Button>
                                        </div>
                                        <Combobox.Options className="z-30 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar">
                                            {filteredUsers.length === 0 &&
                                            query !== "" ? (
                                                <div className="relative cursor-pointer select-none px-4 py-2 text-gray-700">
                                                    Nessuna corrispondenza.
                                                </div>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <Combobox.Option
                                                        key={user.cod_cli}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                                                                    : "text-gray-900 dark:text-white"
                                                            }`
                                                        }
                                                        value={user}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${
                                                                        selected
                                                                            ? "font-medium"
                                                                            : "font-normal"
                                                                    }`}
                                                                >
                                                                    {
                                                                        user.rag_soc
                                                                    }
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600 dark:text-green-300">
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </div>
                                </Combobox>
                            ) : null}
                            {selectedSearchObject.id === 3 ? (
                                <Combobox
                                    value={selectedItem}
                                    onChange={setSelectedItem}
                                    name="item"
                                    disabled={
                                        selectedSearchObject.id === 1
                                            ? true
                                            : false
                                    }
                                    className={
                                        selectedSearchObject.id === 1
                                            ? "opacity-50"
                                            : ""
                                    }
                                >
                                    <div className="relative">
                                        <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                                                displayValue={(item) =>
                                                    item.des_art
                                                }
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                    className="h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </Combobox.Button>
                                        </div>
                                        <Combobox.Options className="z-30 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar">
                                            {filteredItems.length === 0 &&
                                            query !== "" ? (
                                                <div className="relative cursor-pointer select-none px-4 py-2 text-gray-700">
                                                    Nessuna corrispondenza.
                                                </div>
                                            ) : (
                                                filteredItems.map((item) => (
                                                    <Combobox.Option
                                                        key={item.cod_art}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                                                                    : "text-gray-900 dark:text-white"
                                                            }`
                                                        }
                                                        value={item}
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${
                                                                        selected
                                                                            ? "font-medium"
                                                                            : "font-normal"
                                                                    }`}
                                                                >
                                                                    {
                                                                        item.des_art
                                                                    }
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600 dark:text-green-300">
                                                                        <CheckIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Combobox.Option>
                                                ))
                                            )}
                                        </Combobox.Options>
                                    </div>
                                </Combobox>
                            ) : null}
                        </div>
                    )}
                    <div className="w-48 mx-auto">
                        <Listbox
                            value={selectedTop}
                            onChange={setSelectedTop}
                            name="top"
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white py-2 pl-3 pr-10 text-left shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm">
                                    <span className="block truncate">
                                        {selectedTop.name}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="z-30 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm custom-scrollbar">
                                    {tops.map((top) => (
                                        <Listbox.Option
                                            key={top.id}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                                                        : "text-gray-900 dark:text-white"
                                                } ${
                                                    top.unavailable
                                                        ? "opacity-50"
                                                        : ""
                                                }`
                                            }
                                            value={top}
                                            disabled={top.unavailable}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {top.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600 dark:text-green-300">
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>

                    <div className="mx-auto">
                        <button
                            type="button"
                            disabled={disabilitato}
                            className={
                                disabilitato
                                    ? "bg-green-600 dark:bg-green-800 text-white font-bold cursor-not-allowed rounded-lg py-2 px-6 text-center shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm opacity-50"
                                    : "bg-green-600 dark:bg-green-800 hover:bg-green-800 dark:hover:bg-green-900 text-white font-bold cursor-pointer rounded-lg py-2 px-6 text-center shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700 sm:text-sm"
                            }
                            onClick={() => {
                                var id =
                                    selectedSearchObject.id === 2
                                        ? selectedUser.cod_cli
                                        : selectedItem.cod_art;
                                onFetchResults(
                                    selectedSearchObject.valore,
                                    id,
                                    selectedTop.valore
                                );
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
