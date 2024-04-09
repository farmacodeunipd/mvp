import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Cronologia() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
        let amministratore = sessionStorage.getItem("amministratore");
        if (amministratore != 1) {
            navigate("*");
        }
    }, [navigate]);

    const [results, setResults] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState(null);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            user: { value: null, matchMode: FilterMatchMode.CONTAINS },
            algo: { value: null, matchMode: FilterMatchMode.CONTAINS },
            topic: { value: null, matchMode: FilterMatchMode.EQUALS },
            cod_ric: { value: null, matchMode: FilterMatchMode.EQUALS },
            top_sel: { value: null, matchMode: FilterMatchMode.EQUALS },
            id_dat: { value: null, matchMode: FilterMatchMode.CONTAINS }
        });
        setGlobalFilterValue("");
    };

    const clearFilter = () => {
        initFilters();
    };

    useEffect(() => {
        axios
            .get(`http://${expressUrl}/cronologia`)
            .then((res) => setResults(res.data))
            .catch((error) =>
                console.error("Errore nella chiamata clienti:", error)
            );
        initFilters();
    }, []);

    const ptButton = {
        root: {
            className: "!py-2 !px-4 !text-sm",
        },
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <p className="text-2xl text-black">Cronologia</p>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Cancella"
                        pt={ptButton}
                        outlined
                        onClick={clearFilter}
                    />
                    <InputText
                        className="!p-2 ring-1 ring-black/10"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Ricerca..."
                    />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const tableHeight = `${
        window.innerHeight - 4 - 92 - 4 - 52 - 85 - 4 - 24 - 4 - 8
    }px`;

    const ptDataTable = {
        header: {
            className: "rounded-t-3xl bg-gray-200 py-2 px-2",
        },
        thead: {
            className: "sticky top-0 z-50",
        },
        tbody: {
            className: "custom-empty-message",
        },
    };

    const ptColumn = {
        headerCell: {
            className: "bg-gray-200 !text-black !p-2",
        },
        bodyCell: {
            className: "!text-black",
        },
        filterOverlay: {
            className: "!bg-gray-100",
        },
        filterMenuButton: {
            className: "!w-8 !h-8 !bg-gray-800 !text-white",
        },
        filterConstraint: {
            className: "!p-2 custom-filter",
        },
        filterButtonbar: {
            className: "!p-2 custom-filter-button",
        },
    };

    return (
        <>
            <div className="h-screen p-2 flex flex-col gap-2">
                <Header />
                <div className="h-full flex rounded-3xl bg-white border border-gray-300">
                    <DataTable
                        className="w-full rounded-3xl"
                        pt={ptDataTable}
                        paginatorClassName="custom-paginator !rounded-b-3xl"
                        size="small"
                        showGridlines
                        value={results}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        dataKey="cod_cli"
                        paginator
                        emptyMessage="NESSUN RISULTATO TROVATO"
                        currentPageReportTemplate="Mostrando {first} a {last} di {totalRecords} record"
                        rows={25}
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        globalFilterFields={[
                            "user",
                            "algo",
                            "topic",
                            "cod_ric",
                            "top_sel",
                            "id_dat",
                        ]}
                        header={header}
                        filters={filters}
                        scrollHeight={tableHeight}
                    >
                        <Column
                            field="id_dat"
                            header="Data"
                            filter
                            filterPlaceholder="Cerca per data"
                            pt={ptColumn}
                        />
                        <Column
                            field="user"
                            header="Utente"
                            filter
                            filterPlaceholder="Cerca per codice cliente"
                            pt={ptColumn}
                        />
                        <Column
                            field="algo"
                            header="Algoritmo"
                            filter
                            filterPlaceholder="Cerca per algoritmo utilizzato"
                            pt={ptColumn}
                        />
                        <Column
                            field="topic"
                            header="Topic"
                            filter
                            filterPlaceholder="Cerca per codice cliente"
                            pt={ptColumn}
                            body={(rowData) => {
                                const topic_name = rowData.topic === 'item' ? 'Prodotti' : 'Utenti';
                                return <p>{topic_name}</p>;
                            }}
                        />
                        <Column
                            field="cod_ric"
                            header="Codice cliente/prodotto"
                            filter
                            filterPlaceholder="Cerca per codice prodotto"
                            pt={ptColumn}
                        />
                        <Column
                            header="Top"
                            pt={ptColumn}
                            field="top_sel"
                            showFilterMatchModes={false}
                            filter
                            filterPlaceholder="Cerca per codice prodotto"
                        />
                        

                    </DataTable>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Cronologia;
