import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataScroller } from 'primereact/datascroller';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const expressUrl = process.env.EXPRESS_API_URL || 'localhost:3080';

function CategoriaProd() {
    const [results, setResults] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'des_art': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        axios.get(`http://${expressUrl}/categoriaProdotti`)
        .then((res)=>setResults(res.data));
    }, []);

    const header = renderHeader();

    const tableHeight = `${window.innerHeight-64-72}px`;

    return(
        <>
            <div className="h-screen">
                <DataTable value={results} paginatorTemplate="FirstPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                dataKey="cod_art" paginator emptyMessage="NO DATA FOUND" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
                rows={10} rowsPerPageOptions={[10, 25, 50, 100]} globalFilterFields={['des_art']} 
                header={header} filters={filters} scrollHeight={tableHeight}>
                    <Column field="cod_art" header="Codice Articolo"/>
                    <Column field="des_art" filterField="des_art" header="Descrizione Articolo"/>
                    <Column field="cod_linea_comm" header="Codice Linea Commerciale"/>
                    <Column field="cod_sett_comm" header="Codice Settore Commerciale"/>
                    <Column field="cod_fam_comm" header="Codice Famiglia Commerciale"/>
                    <Column field="cod_sott_comm" header="Codice SottoFamiglia Commerciale"/>
                </DataTable>
            </div>
            
        </>
    );
}

export default CategoriaProd;