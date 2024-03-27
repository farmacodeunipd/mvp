import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import Results from "../components/Results";
import axios from "axios";
import { act } from "react-dom/test-utils";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render comnponent results per item", async () => {
    const data = [
        { id: "1", value: 5 },
        { id: "2", value: 4 },
    ];
    const selectObject = "user";
    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Descrizione prodotto 1" }],
    });
    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Descrizione prodotto 2" }],
    });

    await act(async () => {
        render(<Results data={data} selectObject={selectObject} />);
    });

    expect(screen.getByText("Prodotti raccomandati")).toBeInTheDocument();
    expect(screen.getByText("Descrizione prodotto")).toBeInTheDocument();
});

test("render comnponent results per user", async () => {
    const data = [
        { id: "1", value: 5 },
        { id: "2", value: 4 },
    ];
    const selectObject = "item";
    axios.get.mockResolvedValueOnce({
        data: [{ rag_soc: "Ragione sociale 1" }],
    });
    axios.get.mockResolvedValueOnce({
        data: [{ rag_soc: "Ragione sociale 2" }],
    });

    await act(async () => {
        render(<Results data={data} selectObject={selectObject} />);
    });

    expect(screen.getByText("Clienti raccomandati")).toBeInTheDocument();
    expect(screen.getByText("Cliente")).toBeInTheDocument();
});
