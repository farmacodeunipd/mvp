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
import { Dialog}  from "primereact/dialog";

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
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
            cod_cli: { value: null, matchMode: FilterMatchMode.CONTAINS },
            cod_art: { value: null, matchMode: FilterMatchMode.CONTAINS },
            algo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue("");
    };

    const clearFilter = () => {
        initFilters();
    };

    useEffect(() => {
        axios
            .get(`http://${expressUrl}/feedback`)
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
                <p className="text-2xl text-black">Feedback</p>
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

    function deleteFeedback(id_feed){
        console.log(id_feed);
        axios
            .put(`http://${expressUrl}/feedback/delFeed`, {id_feed})
            .then(response => {
                console.log(response.data.message); 
            })
            .catch((error) =>
                console.error("Errore", error)
            );
    }

    const renderProductDialog = () => {
        return (
          <Dialog
            pt={ptDialog}
            visible={showProductDialog}
            style={{ width: '450px' }}
            header="Eliminare feedback?"
            modal
            onHide={() => setShowProductDialog(false)}
          >
            <div className="flex flex-column">
            <p className="text-base font-medium mb-2">
                  ID: {[selectedProduct?.id_feed]}</p>
                <p className="text-base font-medium mb-2">
                  Codice articolo: {[selectedProduct?.cod_art]}</p>
                <p className="text-base font-medium mb-2">Codice cliente: {[selectedProduct?.cod_cli]}</p>
              {/* Add more details about the product as needed */}
              <Button pt={ptButton} label="Conferma" icon="pi pi-check" onClick={ () => {
                                setShowProductDialog(false);
                                deleteFeedback(selectedProduct.id_feed)
                                location.reload();
                              }}/>
            </div>
          </Dialog>
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

    const ptDialog = {
        root: {
            className: "!rounded-3xl",
        },
        header: {
            className: "!p-6 !rounded-t-3xl",
        },
        closeButton: {
            className: "!w-8 !h-8",
        },
        closeButtonIcon: {
            className: "!w-4 !h-4",
        },
        content: {
            className: "!px-6 !pb-8 !rounded-b-3xl",
        },
    };

    const ptButtonIcon = {
        root: {
            className: "!p-1",
        },
        icon: {
            className: "!w-8 !h-8 text-2xl",
        },
        tooltip: {
            root: {
                className: "!shadow-none",
            },
            text: {
                className: "!p-1",
            },
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
                            "id_dat",
                            "cod_cli",
                            "cod_art",
                            "algo",
                        ]}
                        header={header}
                        filters={filters}
                        scrollHeight={tableHeight}
                        selection={selectedProducts}
                        onSelectionChange= {(e) => setSelectedProducts(e.value)}
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
                            filterPlaceholder="Cerca per utente"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_cli"
                            header="ID cliente"
                            filter
                            filterPlaceholder="Cerca per id cliente"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_art"
                            header="ID prodotto"
                            filter
                            filterPlaceholder="Cerca per id prodotto"
                            pt={ptColumn}
                        />
                        <Column
                            field="algo"
                            header="Algoritmo"
                            filter
                            filterPlaceholder="Cerca per algoritmo"
                            pt={ptColumn}
                        />
                        <Column 
                        field="del_feedback" 
                        header="Elimina Feedback" 
                        pt={ptColumn} 
                        body={(rowData) => (
                            <Button
                              pt={ptButtonIcon}
                              icon="pi pi-trash"
                              onClick={() => {
                                setSelectedProduct(rowData);
                                setShowProductDialog(true);
                              }}
                            />
                        )}
                        />
                    </DataTable>
                    {showProductDialog && renderProductDialog()} {/* Render dialog when needed */}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Cronologia;
