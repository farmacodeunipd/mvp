import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

function NoResults() {
    return (
        <>
            <div className="flex items-center justify-center h-full">
                <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-700 rounded-3xl shadow-lg mx-auto max-w-lg">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-600">
                        <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600 dark:text-red-100"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                            Nessun risultato
                        </p>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Prova a modificare i parametri della ricerca
                                prima di riprovare.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NoResults;
