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

function Clienti() {
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
        rag_soc: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        des_prov: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        cod_prov: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
            .get(`http://${expressUrl}/categoriaClienti`)
            .then((res) => setResults(res.data));
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <p className="text-2xl text-black">Clienti</p>
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
                        dataKey="cod_cli"
                        paginator
                        emptyMessage="NO DATA FOUND"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                        rows={25}
                        rowsPerPageOptions={[25, 50, 75, 100]}
                        globalFilterFields={["rag_soc", "des_prov", "cod_prov"]}
                        header={header}
                        filters={filters}
                        scrollHeight={tableHeight}
                    >
                        <Column
                            field="cod_cli"
                            header="Codice Cliente"
                            pt={ptColumn}
                        />
                        <Column
                            field="rag_soc"
                            header="Ragione Sociale"
                            pt={ptColumn}
                        />
                        <Column
                            field="des_prov"
                            header="Provincia"
                            pt={ptColumn}
                        />
                        <Column
                            field="cod_prov"
                            header="Codice Provincia"
                            pt={ptColumn}
                        />
                    </DataTable>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Clienti;
