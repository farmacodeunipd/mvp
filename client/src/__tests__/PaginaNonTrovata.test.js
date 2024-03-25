import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PaginaNonTrovata from "../pages/paginaNonTrovata";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render footer components in PaginaNonTrovata", async () => {
    render(
        <BrowserRouter>
            <PaginaNonTrovata />
        </BrowserRouter>
    );

    const footerElement = await screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
});
