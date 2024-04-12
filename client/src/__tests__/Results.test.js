import "@testing-library/jest-dom/extend-expect";
import React from "react";
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import Results from "../components/Results";
import axios from "axios";
import { act } from "react-dom/test-utils";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

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
    expect(screen.getByText("Descrizione prodotto 1")).toBeInTheDocument();
    expect(screen.getByText("Descrizione prodotto 2")).toBeInTheDocument();
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
    expect(screen.getByText("Ragione sociale 1")).toBeInTheDocument();
    expect(screen.getByText("Ragione sociale 2")).toBeInTheDocument();
});

test("test sendData function sends correct data for user", async () => {
    const data = [
        { id: "1", value: 5 },
        { id: "2", value: 4 },
    ];
    const selectObject = "user";
    const idRic = "1";
    const algoType = "NN";

    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Descrizione prodotto 1" }],
    });
    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Descrizione prodotto 2" }],
    });

    sessionStorage.setItem("username", "a");

    axios.put.mockResolvedValueOnce({
        data: { message: "Inserito con successo" },
    });

    await act(async () => {
        render(
            <Results
                data={data}
                selectObject={selectObject}
                idRic={idRic}
                algoType={algoType}
            />
        );
    });

    const feedbackButton = screen.getAllByTestId("feedback-button")[0];
    fireEvent.click(feedbackButton);

    await waitFor(async () => {
        const dialog = screen.getByTestId("feedback-dialog");
        expect(dialog).toBeInTheDocument();
        const dialogContent = within(dialog).getByText(`ID: ${data[0].id}`);
        expect(dialogContent).toBeInTheDocument();
        const confirmButton = within(dialog).getByText("Conferma");
        fireEvent.click(confirmButton);
        expect(axios.put).toHaveBeenCalledTimes(1);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/feedback/newUser`,
            { user: "a", id: "1", idRic: "1", algoType: "NN" }
        );
    });
});

test("test sendData function sends correct data for item", async () => {
    const data = [
        { id: "1", value: 5 },
        { id: "2", value: 4 },
    ];
    const selectObject = "item";
    const idRic = "1";
    const algoType = "NN";

    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Ragione sociale 1" }],
    });
    axios.get.mockResolvedValueOnce({
        data: [{ des_art: "Ragione sociale 2" }],
    });

    sessionStorage.setItem("username", "a");

    axios.put.mockResolvedValueOnce({
        data: { message: "Inserito con successo" },
    });

    await act(async () => {
        render(
            <Results
                data={data}
                selectObject={selectObject}
                idRic={idRic}
                algoType={algoType}
            />
        );
    });

    const feedbackButton = screen.getAllByTestId("feedback-button")[0];
    fireEvent.click(feedbackButton);

    await waitFor(async () => {
        const dialog = screen.getByTestId("feedback-dialog");
        expect(dialog).toBeInTheDocument();
        const dialogContent = within(dialog).getByText(`ID: ${data[0].id}`);
        expect(dialogContent).toBeInTheDocument();
        const confirmButton = within(dialog).getByText("Conferma");
        fireEvent.click(confirmButton);
        expect(axios.put).toHaveBeenCalledTimes(1);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/feedback/newItem`,
            { user: "a", id: "1", idRic: "1", algoType: "NN" }
        );
    });
});
