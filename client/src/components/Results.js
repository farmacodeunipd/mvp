import React, { useState, useEffect } from "react";
import axios from "axios";
import { StarIcon } from "@heroicons/react/20/solid";

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

async function getUser(id) {
    const response = await axios.get(`http://${expressUrl}/users/${id}`);
    return response.data[0].rag_soc;
}

async function getItem(id) {
    const response = await axios.get(`http://${expressUrl}/items/${id}`);
    return response.data[0].des_art;
}

function Results({ data, selectObject }) {
    const [names, setNames] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const promises = data.map(async (object) => {
                let value;
                if (selectObject.id === 2) {
                    value = await getItem(object.id);
                } else if (selectObject.id === 3) {
                    value = await getUser(object.id);
                } else {
                    console.log("errore");
                    value = "";
                }
                return value;
            });

            const resolvedValues = await Promise.all(promises);

            setNames(resolvedValues);
        };
        fetchData();
    }, [data, selectObject]);

    return (
        <>
            <div className="overflow-y-auto custom-scrollbar shadow-lg ring-1 ring-black ring-opacity-5 md:mx-0 rounded-3xl">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-950">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-base font-semibold text-gray-900 dark:text-white sm:pl-6"
                            >
                                Id
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-base font-semibold text-gray-900 dark:text-white"
                            >
                                Nome
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900 dark:text-white lg:table-cell"
                            >
                                Valore
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-900 bg-white dark:bg-gray-600">
                        {data.map((data, index) => (
                            <tr key={data.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                    {data.id}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500  dark:text-gray-200">
                                    {names[index]
                                        ? names[index]
                                        : "-- NON TROVATO --"}
                                </td>
                                <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500  dark:text-gray-200 lg:table-cell">
                                    {/* {data.value} */}
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                className={classNames(
                                                    data.value >= rating
                                                        ? "text-gray-800 dark:text-gray-900"
                                                        : "text-gray-300 dark:text-gray-200",
                                                    "h-5 w-5 flex-shrink-0"
                                                )}
                                            ></StarIcon>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Results;
