import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataScroller } from 'primereact/datascroller';
import Footer from '../components/Footer';

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';

function CatProd() {
    const [results, setResults] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    
    {/*
    useEffect(() => {
        getItems();
    }, []);

    async function getItems() {
        const response = await axios.get(`http://${expressUrl}/items`);
        setResults(response.data);
    }
    */}

    {/*
    const loadData = useCallback(async () => {
        try {
            const response = await axios.get(`http://${expressUrl}/prova?page=${pageNumber}`);
            // Aggiungiamo i nuovi dati solo se ci sono elementi nella risposta
            if (response.data.length > 0) {
                setResults((prev) => [...prev, ...response.data]);
                // Incrementiamo il numero di pagina per la prossima richiesta
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [pageNumber]); // Aggiungiamo pageNumber come dipendenza per assicurarci che la funzione venga ricreata quando cambia
    */}

    {/*
    const loadData = useCallback(async () => {
        const response = await axios.get(`http://${expressUrl}/items`);
        setResults((prev) => [...prev, ...response.data]);
    }, []);
    */}

    //modifica chatGPT
    useEffect(() => {
        fetchData();
    }, [pageNumber]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://${expressUrl}/prova?page=${pageNumber}`);
            setResults(prev => [...prev, ...response.data]);
        } catch (error) {
            console.error("Errore nel recupero dei dati:", error);
        } finally {
            setLoading(false);
        }
    };

    const itemTemplate = (data) =>{
        return (
            <div key={data.cod_art}>
                <p className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    {data.cod_art}
                </p>
                <p className="whitespace-nowrap px-3 py-4 text-sm text-gray-500  dark:text-gray-200">
                    {data.des_art ? data.des_art : "-- NON TROVATO --"}
                </p>
            </div>
        )
    }

    return (
        <>        
            <div className="custom-scrollbar shadow-lg ring-1 ring-black ring-opacity-5 md:mx-0 rounded-3xl">
                <DataScroller 
                    value={results} 
                    itemTemplate={itemTemplate} r
                    rows={8} // Numero di elementi da visualizzare contemporaneamente
                    inline
                    scrollHeight="500px"
                    buffer={0.4} // Percentuale di buffer per il caricamento anticipato
                    onLazyLoad={fetchData} // Callback per il caricamento lazy
                    loading={loading} // Indicatore di caricamento
                    header="Lista dei Prodotti"
                />
            </div>
            <Footer/>
        </>
    );
}

export default CatProd;