import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Profilo from "../pages/profilo";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in Profilo", async () => {
    await act(async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const footerElement = await screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
});
