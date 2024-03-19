import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Ricerca from "../pages/ricerca";

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("renders footer component", () => {
    render(
        <BrowserRouter>
            <Ricerca />
        </BrowserRouter>
    );
    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
});
