import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { Button } from 'primereact/button'; 
import { Dialog } from 'primereact/dialog';


const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080"; // Add 'http://' to the URL

async function getUser(id) {
    const response = await axios.get(`http://${expressUrl}/users/${id}`); // Use 'expressUrl'
    return response.data[0]?.rag_soc; // Use optional chaining to avoid errors
}

async function getItem(id) {
    const response = await axios.get(`http://${expressUrl}/items/${id}`); // Use 'expressUrl'
    return response.data[0]?.des_art; // Use optional chaining to avoid errors
}

function Results({ data, selectObject, idRic, algoType }) {
    const [additionalData, setAdditionalData] = useState({});
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    function sendData(id) {
        const user = sessionStorage.getItem("username");
        console.log(user + " " + id + " " + idRic + " " + algoType);
        console.log(selectObject);
        if (selectObject === "user") {
            axios
            .put(`http://${expressUrl}/feedback/newUser`, {user, id, idRic, algoType})
            .then(response => {
                console.log(response.data.message); // Log per verificare la risposta del server
            })
            .catch((error) =>
                console.error("Errore", error)
            );
        } else {
            axios
            .put(`http://${expressUrl}/feedback/newItem`, {user, id, idRic, algoType})
            .then(response => {
                console.log(response.data.message); // Log per verificare la risposta del server
            })
            .catch((error) =>
                console.error("Errore 2", error)
            );
        }
        
    }

    const renderProductDialog = () => {
        return (
          <Dialog
            pt={ptDialog}
            visible={showProductDialog}
            style={{ width: '450px' }}
            header="Conferma feedback" // Dialog header
            modal
            onHide={() => setShowProductDialog(false)}
          >
            <div className="flex flex-column">
              <p className="text-base font-medium mb-2">ID: {selectedProduct?.id}</p>
              {selectObject === "user" && (
                <p className="text-base font-medium mb-2">
                  Descrizione prodotto: {additionalData[selectedProduct?.id]}
                </p>
              )}
              {selectObject === "item" && (
                <p className="text-base font-medium mb-2">Cliente: {additionalData[selectedProduct?.id]}</p>
              )}
              {/* Add more details about the product as needed */}
              <Button pt={ptButton} label="Conferma" icon="pi pi-check" onClick={() => {
                                sendData(selectedProduct.id)
                                setShowProductDialog(false);
                              }}/>
            </div>
          </Dialog>
        );
      };

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

    const ptButton = {
        root: {
            className: "!px-3 !py-1 !gap-2 !flex !justify-center",
        },
        label: {
            className: "!flex-none",
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
                    selection={selectedProducts}
                    onSelectionChange= {(e) => setSelectedProducts(e.value)}
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
                        body={(rowData) => (
                            <Button
                              pt={ptButtonIcon}
                              icon="pi pi-thumbs-down"
                              
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
        </>
    );
}

// PropTypes validation
Results.propTypes = {
    data: PropTypes.array.isRequired,
    selectObject: PropTypes.string.isRequired,
    idRic: PropTypes.string.isRequired,
    algoType: PropTypes.string.isRequired,
};

export default Results;
