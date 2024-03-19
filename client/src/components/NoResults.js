function NoResults() {
    return (
        <>
            <div className="flex items-center justify-center h-full">
                <div className="p-4 space-y-2 bg-gray-200 border border-gray-300 rounded-3xl mx-auto max-w-lg">
                    <div className="mx-auto flex items-center justify-center !h-12 !w-12 rounded-full bg-red-200">
                        <span className="pi pi-exclamation-triangle text-xl text-red-600"></span>
                    </div>
                    <div className="mt-3 text-center">
                        <p className="text-base font-semibold leading-6 text-black">
                            Nessun risultato
                        </p>
                        <div className="mt-2">
                            <p className="text-sm text-gray-800">
                                Prova a modificare i parametri della ricerca
                                prima di riprovare
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NoResults;
