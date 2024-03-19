import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
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
    });

    const [results, setResults] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cod_art: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        des_art: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        axios
            .get(`http://${expressUrl}/categoriaProdotti`)
            .then((res) => setResults(res.data));
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <p className="text-2xl text-black">Prodotti</p>
                <InputText
                    className="p-1 px-2 ring-1 ring-black/10"
                    size="small"
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Ricerca..."
                />
            </div>
        );
    };

    const header = renderHeader();

    const tableHeight = `${
        window.innerHeight - 4 - 92 - 4 - 52 - 85 - 4 - 24 - 4
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
            className: "bg-gray-200 !text-black",
        },
        bodyCell: {
            className: "!text-black",
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
                    >
                        <Column
                            field="cod_art"
                            header="Codice Articolo"
                            pt={ptColumn}
                        />
                        <Column
                            field="des_art"
                            filterField="des_art"
                            header="Descrizione Articolo"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_linea_comm"
                            header="LC"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_sett_comm"
                            header="SC"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_fam_comm"
                            header="FC"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_sott_comm"
                            header="SFC"
                            pt={ptColumn}
                        />
                    </DataTable>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Prodotti;
