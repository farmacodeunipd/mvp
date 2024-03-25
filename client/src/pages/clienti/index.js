import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Clienti() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
    }, [navigate]);

    const [results, setResults] = useState([]);
    const [prov, setProv] = useState([]);
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
            cod_cli: { value: null, matchMode: FilterMatchMode.EQUALS },
            rag_soc: { value: null, matchMode: FilterMatchMode.CONTAINS },
            prov: { value: null, matchMode: FilterMatchMode.IN },
        });
        setGlobalFilterValue("");
    };

    const clearFilter = () => {
        initFilters();
    };

    useEffect(() => {
        axios
            .get(`http://${expressUrl}/clienti`)
            .then((res) => setResults(res.data))
            .catch((error) =>
                console.error("Errore nella chiamata clienti:", error)
            );
        axios
            .get(`http://${expressUrl}/clienti/province`)
            .then((res) => setProv(res.data))
            .catch((error) =>
                console.error("Errore nella chiamata province:", error)
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
                <p className="text-2xl text-black">Clienti</p>
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

    const provBodyTemplate = (rowData) => {
        const prov = rowData.prov;
        return (
            <div className="flex align-items-center gap-2">
                <span>
                    {prov.des_prov} ({prov.cod_prov})
                </span>
            </div>
        );
    };

    const provFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={prov}
                itemTemplate={provItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="des_prov"
                placeholder="Tutti"
                maxSelectedLabels={1}
                pt={ptMultiSelect}
            />
        );
    };

    const provItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.des_prov}</span>
            </div>
        );
    };

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

    const ptMultiSelect = {
        input: {
            className: "!p-2 !duration-0",
        },
        label: {
            className: "!px-2 !py-2",
        },
        trigger: {
            className: "!w-12",
        },
        triggerIcon: {
            className: "text-md",
        },
        panel: {
            className: "!duration-0 !transition-none",
        },
        headerCheckboxContainer: {
            className: "custom-checkbox",
        },
        headerCheckbox: {
            className: "!border-0",
        },
        closeButton: {
            className: "!w-6 !h-6",
        },
        item: {
            className: "!p-2 flex",
        },
        checkboxContainer: {
            className: "!w-6 !h-6",
        },
        checkbox: {
            className: "!w-6 !h-6",
        },
        checkboxIcon: {
            className: "!w-4 !h-4",
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
                        emptyMessage="NO DATA FOUND"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                        rows={25}
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        globalFilterFields={[
                            "cod_cli",
                            "rag_soc",
                            "prov.des_prov",
                            "prov.cod_prov",
                        ]}
                        header={header}
                        filters={filters}
                        scrollHeight={tableHeight}
                    >
                        <Column
                            field="cod_cli"
                            header="Codice Cliente"
                            filter
                            filterPlaceholder="Cerca per codice cliente"
                            pt={ptColumn}
                        />
                        <Column
                            field="rag_soc"
                            header="Ragione Sociale"
                            filter
                            filterPlaceholder="Cerca per ragione sociale"
                            pt={ptColumn}
                        />
                        <Column
                            body={provBodyTemplate}
                            header="Provincia"
                            pt={ptColumn}
                            filterField="prov"
                            // showFilterMenu={false}
                            showFilterMatchModes={false}
                            filter
                            filterElement={provFilterTemplate}
                        />
                    </DataTable>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Clienti;
