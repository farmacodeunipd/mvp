import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Cronologia from "../pages/cronologia";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in Cronologia", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Cronologia />
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
                <Cronologia />
            </BrowserRouter>
        );
    });

    const algo = "NN";
    const ricercaInput = screen.getByPlaceholderText("Ricerca...");
    fireEvent.change(ricercaInput, { target: { value: algo } });

    expect(ricercaInput.value).toBe("NN");
});
