import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog'; 
import { confirmDialog } from 'primereact/confirmdialog'; 

const expressUrl = process.env.EXPRESS_API_URL || "http://localhost:3080"; // Add 'http://' to the URL

async function getUser(id) {
    const response = await axios.get(`${expressUrl}/users/${id}`); // Use 'expressUrl'
    return response.data[0]?.rag_soc; // Use optional chaining to avoid errors
}

async function getItem(id) {
    const response = await axios.get(`${expressUrl}/items/${id}`); // Use 'expressUrl'
    return response.data[0]?.des_art; // Use optional chaining to avoid errors
}

function Results({ data, selectObject }) {
    const [additionalData, setAdditionalData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const additionalDataMap = {};
            for (const item of data) {
                let name;
                if (selectObject === "user") {
                    name = await getItem(item.id);
                } else if (selectObject === "item") {
                    name = await getUser(item.id);
                }
                additionalDataMap[item.id] = name;
            }
            setAdditionalData(additionalDataMap);
        };
        fetchData();
    }, [data, selectObject]);

    //const user = sessionStorage.getItem("username");


    //FINESTRE DI AVVISO
    const confirm1 = () => {
        confirmDialog({
            message: 'Sicuro di voler inserire un feedback positivo?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
        });
        
    };
    
    const confirm2 = () => {
        confirmDialog({
            message: 'Sicuro di voler inserire un feedback negativo?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
        });
        
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <p className="text-2xl text-black">
                    {selectObject === "user"
                        ? "Prodotti raccomandati"
                        : "Clienti raccomandati"}
                </p>
            </div>
        );
    };

    //BOTTONI FEEDBACK
    const renderFeedbackButton = () => (
        <>
            <div>
                <Button onClick={confirm1} icon="pi pi-thumbs-up" className="mr-10" />
                <Button onClick={confirm2} icon="pi pi-thumbs-down" />
            </div>
        </>
    );

    const button = renderFeedbackButton();

    const header = renderHeader();

    const tableHeight = `${
        window.innerHeight - 4 - 92 - 4 - 52 - 125 - 4 - 24 - 4
    }px`;

    const ptDataTable = {
        root: {
            className: "bg-gray-200",
        },
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

    const ptRating = {
        item: {
            className: "!shadow-none",
        },
        onIcon: {
            className: "!w-4 !h-4",
        },
        offIcon: {
            className: "!w-4 !h-4 hover:!text-gray-700",
        },
    };

    return (
        <>
            <div className="h-full flex rounded-3xl bg-gray-200 border border-gray-300">
                <DataTable
                    className="w-full rounded-3xl"
                    pt={ptDataTable}
                    size="small"
                    value={data}
                    dataKey="id" // Use string 'id' instead of data.id
                    emptyMessage="NO DATA FOUND"
                    rows={20}
                    header={header}
                    scrollHeight={tableHeight}
                >
                    <Column field="id" header="ID" pt={ptColumn} />
                    <Column
                        field={(rowData) => additionalData[rowData.id]}
                        header={
                            selectObject === "user"
                                ? "Descrizione prodotto"
                                : "Cliente"
                        }
                        pt={ptColumn}
                    />
                    <Column
                        header="Raccomandazione"
                        body={(rowData) => (
                            <Rating
                                value={rowData.value}
                                readOnly
                                cancel={false}
                                pt={ptRating}
                            />
                        )}
                        pt={ptColumn}
                    />
                    <Column 
                        field="feedback" 
                        header="Feedback" 
                        pt={ptColumn} 
                        body={button}
                    />
                </DataTable>
                <ConfirmDialog />
            </div>
        </>
    );
}

// PropTypes validation
Results.propTypes = {
    data: PropTypes.array.isRequired,
    selectObject: PropTypes.string.isRequired,
};

export default Results;
