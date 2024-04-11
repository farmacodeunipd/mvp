import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Feedback from "../pages/feedback";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in Feedback", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Feedback />
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
                <Feedback />
            </BrowserRouter>
        );
    });

    const algo = "NN";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: algo } });

    expect(ricercaInput.value).toBe("NN");
});

test("test successful deletion of a feedback", async () => {
    const mockFeedback = {
        id_feed: 1,
        id_art: "2024-04-10",
        user: "a",
        cod_cli: "1",
        cod_art: "1101100",
        algo: "NN",
    };
    axios.get.mockResolvedValue({ data: [mockFeedback] });
    axios.put.mockResolvedValueOnce({
        data: { message: "eliminato con successo" },
    });

    await act(async () => {
        render(
            <BrowserRouter>
                <Feedback />
            </BrowserRouter>
        );
    });

    await waitFor(() => {
        const deleteButton = screen.getAllByTestId("delete-button");
        fireEvent.click(deleteButton[0]);
    });
    await waitFor(() => {
        const confirmButton = screen.getByText("Conferma");
        fireEvent.click(confirmButton);
    });

    await waitFor(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining(`/feedback/delFeed`),
            expect.any(Object)
        );
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/feedback/delFeed`,
            { id_feed: mockFeedback.id_feed }
        );
    });
});
