import "@testing-library/jest-dom/extend-expect";
import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Prodotti from "../pages/prodotti";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in Prodotti", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Prodotti />
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
                <Prodotti />
            </BrowserRouter>
        );
    });

    const descrizioneArticolo = "ACQUA 1L";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: descrizioneArticolo } });

    expect(ricercaInput.value).toBe(descrizioneArticolo);
});

test("test clear filter button functionality", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Prodotti />
            </BrowserRouter>
        );
    });

    const descrizioneArticolo = "ACQUA 1L";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: descrizioneArticolo } });

    expect(ricercaInput.value).toBe(descrizioneArticolo);

    const clearButton = screen.getByTestId("clear-button");
    fireEvent.click(clearButton);

    expect(ricercaInput.value).toBe("");
});

test("test render of data", async () => {
    const mockData = [
        {
            cod_art: "1101100",
            des_art: "ROGASKA ACQUA MINERALE TV SORGENTE DONAT",
            lineecomm: {
                cod_linea_comm: "11",
                linea_comm: "ACQUE",
            },
            settoricomm: {
                cod_sett_comm: "2T",
                sett_comm: "ACQ.MIN, FINO A CC 1000X6 VAR",
            },
            famigliecomm: {
                cod_fam_comm: "NB",
                fam_comm: "NO BRAND",
            },
            sottofamigliecomm: {
                cod_sott_comm: null,
                sott_comm: null,
            },
        },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
        render(
            <BrowserRouter>
                <Prodotti />
            </BrowserRouter>
        );
    });

    const prodotto1CodArt = await screen.findByText("1101100");
    const prodotto1DesArt = await screen.findByText(
        "ROGASKA ACQUA MINERALE TV SORGENTE DONAT"
    );
    const prodotto1LC = await screen.findByText("11");
    const prodotto1SC = await screen.findByText("2T");
    const prodotto1FC = await screen.findByText("NB");

    expect(prodotto1CodArt).toBeInTheDocument();
    expect(prodotto1DesArt).toBeInTheDocument();
    expect(prodotto1LC).toBeInTheDocument();
    expect(prodotto1SC).toBeInTheDocument();
    expect(prodotto1FC).toBeInTheDocument();
});

test("test product detail dialog visibility", async () => {
    const mockData = [
        {
            cod_art: "1101100",
            des_art: "ROGASKA ACQUA MINERALE TV SORGENTE DONAT",
            lineecomm: {
                cod_linea_comm: "11",
                linea_comm: "ACQUE",
            },
            settoricomm: {
                cod_sett_comm: "2T",
                sett_comm: "ACQ.MIN, FINO A CC 1000X6 VAR",
            },
            famigliecomm: {
                cod_fam_comm: "NB",
                fam_comm: "NO BRAND",
            },
            sottofamigliecomm: {
                cod_sott_comm: null,
                sott_comm: null,
            },
        },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
        render(
            <BrowserRouter>
                <Prodotti />
            </BrowserRouter>
        );
    });

    const firstRow = screen.getAllByRole("row")[1];
    fireEvent.click(firstRow);

    await waitFor(() => {
        const dialog = screen.getByTestId("dialog");
        expect(dialog).toBeInTheDocument();
        const dialogTitle = within(dialog).getByText(
            `Dettaglio prodotto ${mockData[0].cod_art}`
        );
        expect(dialogTitle).toBeInTheDocument();
    });
});

test("test multiselect rendering", async () => {
    const mockData = [
        {
            cod_art: "1101100",
            des_art: "ROGASKA ACQUA MINERALE TV SORGENTE DONAT",
            lineecomm: {
                cod_linea_comm: "11",
                linea_comm: "ACQUE",
            },
            settoricomm: {
                cod_sett_comm: "2T",
                sett_comm: "ACQ.MIN, FINO A CC 1000X6 VAR",
            },
            famigliecomm: {
                cod_fam_comm: "NB",
                fam_comm: "NO BRAND",
            },
            sottofamigliecomm: {
                cod_sott_comm: null,
                sott_comm: null,
            },

            options: ["Option 1", "Option 2", "Option 3"],
        },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    await act(async () => {
        render(
            <BrowserRouter>
                <Prodotti />
            </BrowserRouter>
        );
    });

    const openFilterButton = screen.getAllByRole("button", {
        name: "Show Filter Menu",
    })[2];
    fireEvent.click(openFilterButton);

    await waitFor(() => {
        expect(screen.getByText("Tutti")).toBeInTheDocument();
    });

    // const multiselectTrigger = screen.getByTestId("multiselect");
    // fireEvent.click(multiselectTrigger);

    // await waitFor(() => {
    //     // mockData[0].options.forEach((option) => {
    //     //     const optionElement = screen.getByText(option);
    //     //     expect(optionElement).toBeInTheDocument();
    //     // });
    //     expect(screen.getByText("Option 1")).toBeInTheDocument();
    // });
});
