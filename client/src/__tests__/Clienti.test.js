import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Clienti from "../pages/clienti";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in Clienti", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Clienti />
            </BrowserRouter>
        );
    });

    const footerElement = await screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
});

test("test working global filter", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Clienti />
            </BrowserRouter>
        );
    });

    const ragioneSociale = "CLIENTE 1";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: ragioneSociale } });

    expect(ricercaInput.value).toBe(ragioneSociale);
});

test("test clear filter button functionality", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Clienti />
            </BrowserRouter>
        );
    });

    const ragioneSociale = "CLIENTE 1";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: ragioneSociale } });

    expect(ricercaInput.value).toBe(ragioneSociale);

    const clearButton = screen.getByTestId("clear-button");
    fireEvent.click(clearButton);

    expect(ricercaInput.value).toBe("");
});

test("test render of data", async () => {
    const mockData = [
        {
            cod_cli: 13,
            rag_soc: "CLIENTE 13",
            prov: {
                cod_prov: "PN",
                des_prov: "PORDENONE",
            },
        },
        {
            cod_cli: 15,
            rag_soc: "CLIENTE 15",
            prov: {
                cod_prov: "VE",
                des_prov: "VENEZIA",
            },
        },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
        render(
            <BrowserRouter>
                <Clienti />
            </BrowserRouter>
        );
    });

    const cliente1CodCli = await screen.findByText("13");
    const cliente1RagSoc = await screen.findByText("CLIENTE 13");
    const cliente1Provincia = await screen.findByText("PORDENONE (PN)");

    const cliente2CodCli = await screen.findByText("15");
    const cliente2RagSoc = await screen.findByText("CLIENTE 15");
    const cliente2Provincia = await screen.findByText("VENEZIA (VE)");

    expect(cliente1CodCli).toBeInTheDocument();
    expect(cliente1RagSoc).toBeInTheDocument();
    expect(cliente1Provincia).toBeInTheDocument();

    expect(cliente2CodCli).toBeInTheDocument();
    expect(cliente2RagSoc).toBeInTheDocument();
    expect(cliente2Provincia).toBeInTheDocument();
});
