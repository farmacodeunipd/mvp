import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import Footer from '../components/Footer';

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';

function CatProd() {
    const [results, setResults] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'rag_soc': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'des_prov': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'cod_prov': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    useEffect(() => {
        axios.get(`http://${expressUrl}/categoriaClienti`)
        .then((res)=>setResults(res.data));
    }, []);

    const header = renderHeader();

    const tableHeight = `${window.innerHeight-86-64-48-72-24}px`;

    return (
        <>        
            <div className="custom-scrollbar shadow-lg ring-1 ring-black ring-opacity-5 md:mx-0 rounded-3xl">
                <DataTable value={results} paginatorTemplate="FirstPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    dataKey="cod_cli" paginator emptyMessage="NO DATA FOUND" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                    rows={25} rowsPerPageOptions={[25, 50, 75, 100]} globalFilterFields={['rag_soc','des_prov','cod_prov']} 
                    header={header} filters={filters} scrollHeight={tableHeight}>
                        <Column field="cod_cli" header="Codice Cliente"/>
                        <Column field="rag_soc" header="Ragione Sociale"/>
                        <Column field="des_prov" header="Provincia"/>
                        <Column field="cod_prov" header="Codice Provincia"/>
                        </DataTable>
            </div>
            <Footer/>
        </>
    );
}

export default CatProd;