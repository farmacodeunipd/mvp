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
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Prodotti() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
    }, [navigate]);

    const [results, setResults] = useState([]);
    const [lineecomm, setLineecomm] = useState([]);
    const [settoricomm, setSettoricomm] = useState([]);
    const [famigliecomm, setFamigliecomm] = useState([]);
    const [sottofamigliecomm, setSottofamigliecomm] = useState([]);
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
            cod_art: { value: null, matchMode: FilterMatchMode.EQUALS },
            des_art: { value: null, matchMode: FilterMatchMode.CONTAINS },
            lineecomm: { value: null, matchMode: FilterMatchMode.IN },
            settoricomm: { value: null, matchMode: FilterMatchMode.IN },
            famigliecomm: { value: null, matchMode: FilterMatchMode.IN },
            sottofamigliecomm: { value: null, matchMode: FilterMatchMode.IN },
        });
        setGlobalFilterValue("");
    };

    const clearFilter = () => {
        initFilters();
    };

    useEffect(() => {
        axios
            .get(`http://${expressUrl}/prodotti`)
            .then((res) => setResults(res.data))
            .catch((error) =>
                console.error("Errore nella chiamata prodotti:", error)
            );
        axios
            .get(`http://${expressUrl}/prodotti/lineecommerciali`)
            .then((res) => setLineecomm(res.data))
            .catch((error) =>
                console.error(
                    "Errore nella chiamata prodotti/lineecommerciali:",
                    error
                )
            );
        axios
            .get(`http://${expressUrl}/prodotti/settoricommerciali`)
            .then((res) => setSettoricomm(res.data))
            .catch((error) =>
                console.error(
                    "Errore nella chiamata prodotti/settoricommerciali:",
                    error
                )
            );
        axios
            .get(`http://${expressUrl}/prodotti/famigliecommerciali`)
            .then((res) => setFamigliecomm(res.data))
            .catch((error) =>
                console.error(
                    "Errore nella chiamata prodotti/famigliecommerciali:",
                    error
                )
            );
        axios
            .get(`http://${expressUrl}/prodotti/sottofamigliecommerciali`)
            .then((res) => setSottofamigliecomm(res.data))
            .catch((error) =>
                console.error(
                    "Errore nella chiamata prodotti/sottofamigliecommerciali:",
                    error
                )
            );
    }, []);

    const ptButton = {
        root: {
            className: "!py-2 !px-4 !text-sm",
        },
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <p className="text-2xl text-black">Prodotti</p>
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

    const lineecommFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={lineecomm}
                itemTemplate={lineecommItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="linea_comm"
                placeholder="Tutti"
                maxSelectedLabels={1}
                pt={ptMultiSelect}
            />
        );
    };

    const lineecommItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>
                    {option.linea_comm} ({option.cod_linea_comm})
                </span>
            </div>
        );
    };

    const settoricommFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={settoricomm}
                itemTemplate={settoricommItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="sett_comm"
                placeholder="Tutti"
                maxSelectedLabels={1}
                pt={ptMultiSelect}
            />
        );
    };

    const settoricommItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>
                    {option.sett_comm} ({option.cod_sett_comm})
                </span>
            </div>
        );
    };

    const famigliecommFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={famigliecomm}
                itemTemplate={famigliecommItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="fam_comm"
                placeholder="Tutti"
                maxSelectedLabels={1}
                pt={ptMultiSelect}
            />
        );
    };

    const famigliecommItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>
                    {option.fam_comm} ({option.cod_fam_comm})
                </span>
            </div>
        );
    };

    const sottofamigliecommFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={sottofamigliecomm}
                itemTemplate={sottofamigliecommItemTemplate}
                onChange={(e) => options.filterCallback(e.value)}
                optionLabel="sott_comm"
                placeholder="Tutti"
                maxSelectedLabels={1}
                pt={ptMultiSelect}
            />
        );
    };

    const sottofamigliecommItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>
                    {option.sott_comm} ({option.cod_sott_comm})
                </span>
            </div>
        );
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dialogProduct, setDialogProduct] = useState(null);
    const [visible, setVisible] = useState(false);

    const onRowSelect = (e) => {
        console.log("Selezionato --> " + e.data.cod_art);
        console.log("--> " + selectedProduct);
        setVisible(true);
        setDialogProduct(e.data);
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
        bodyRow: {
            className:
                "focus:!outline-none !bg-white hover:!bg-gray-100 !duration-0",
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

    const ptDialog = {
        header: {
            className: "!p-6",
        },
        closeButton: {
            className: "!w-8 !h-8",
        },
        closeButtonIcon: {
            className: "!w-4 !h-4",
        },
        content: {
            className: "!px-6 !pb-8",
        },
    };

    const ptDivider = {
        root: {
            className: "!my-4 before:!border-gray-300",
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
                        dataKey="cod_art"
                        paginator
                        emptyMessage="NO DATA FOUND"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                        rows={25}
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        globalFilterFields={["cod_art", "des_art"]}
                        header={header}
                        filters={filters}
                        scrollHeight={tableHeight}
                        selectionMode="single"
                        selection={selectedProduct}
                        onSelectionChange={(e) => setSelectedProduct(e.value)}
                        onRowSelect={onRowSelect}
                        metaKeySelection={false}
                    >
                        <Column
                            field="cod_art"
                            header="Codice Articolo"
                            filter
                            filterPlaceholder="Cerca per codice articolo"
                            pt={ptColumn}
                        />
                        <Column
                            field="des_art"
                            header="Descrizione Articolo"
                            filter
                            filterPlaceholder="Cerca per descrione articolo"
                            pt={ptColumn}
                        />
                        <Column
                            field="lineecomm.cod_linea_comm"
                            header="LC"
                            pt={ptColumn}
                            filterField="lineecomm"
                            showFilterMatchModes={false}
                            filter
                            filterElement={lineecommFilterTemplate}
                        />
                        <Column
                            field="settoricomm.cod_sett_comm"
                            header="SC"
                            pt={ptColumn}
                            filterField="settoricomm"
                            showFilterMatchModes={false}
                            filter
                            filterElement={settoricommFilterTemplate}
                        />
                        <Column
                            field="famigliecomm.cod_fam_comm"
                            header="FC"
                            pt={ptColumn}
                            filterField="famigliecomm"
                            showFilterMatchModes={false}
                            filter
                            filterElement={famigliecommFilterTemplate}
                        />
                        <Column
                            field="sottofamigliecomm.cod_sott_comm"
                            header="SFC"
                            pt={ptColumn}
                            filterField="sottofamigliecomm"
                            showFilterMatchModes={false}
                            filter
                            filterElement={sottofamigliecommFilterTemplate}
                        />
                    </DataTable>
                    {dialogProduct ? (
                        <Dialog
                            header={
                                "Dettaglio prodotto " + dialogProduct.cod_art
                            }
                            visible={visible}
                            pt={ptDialog}
                            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                            onHide={() => setVisible(false)}
                        >
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Codice articolo:
                                </p>
                                <p>{dialogProduct.cod_art}</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Descrizione articolo:
                                </p>
                                <p>{dialogProduct.des_art}</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div>
                                <p className="w-2/5 text-md text-black font-medium mb-2">
                                    Linea commerciale
                                </p>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Codice linea commerciale:
                                    </p>
                                    <p>
                                        {dialogProduct.lineecomm.cod_linea_comm}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Descrizione linea commerciale:
                                    </p>
                                    <p>{dialogProduct.lineecomm.linea_comm}</p>
                                </div>
                            </div>
                            <Divider pt={ptDivider} />
                            <div>
                                <p className="w-2/5 text-md text-black font-medium mb-2">
                                    Settore commerciale
                                </p>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Codice settore commerciale:
                                    </p>
                                    <p>
                                        {
                                            dialogProduct.settoricomm
                                                .cod_sett_comm
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Descrizione settore commerciale:
                                    </p>
                                    <p>{dialogProduct.settoricomm.sett_comm}</p>
                                </div>
                            </div>
                            <Divider pt={ptDivider} />
                            <div>
                                <p className="w-2/5 text-md text-black font-medium mb-2">
                                    Famiglia commerciale
                                </p>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Codice famiglia commerciale:
                                    </p>
                                    <p>
                                        {
                                            dialogProduct.famigliecomm
                                                .cod_fam_comm
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Descrizione famiglia commerciale:
                                    </p>
                                    <p>{dialogProduct.famigliecomm.fam_comm}</p>
                                </div>
                            </div>
                            <Divider pt={ptDivider} />
                            <div>
                                <p className="w-2/5 text-md text-black font-medium mb-2">
                                    Sottofamiglia commerciale
                                </p>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Codice sottofamiglia commerciale:
                                    </p>
                                    <p>
                                        {
                                            dialogProduct.sottofamigliecomm
                                                .cod_sott_comm
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-2/5 text-md text-black font-medium">
                                        Descrizione sottofamiglia commerciale:
                                    </p>
                                    <p>
                                        {
                                            dialogProduct.sottofamigliecomm
                                                .sott_comm
                                        }
                                    </p>
                                </div>
                            </div>
                        </Dialog>
                    ) : null}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Prodotti;
