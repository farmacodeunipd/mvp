import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

test("test normal use filter", async () => {
    render(
        <BrowserRouter>
            <Ricerca />
        </BrowserRouter>
    );

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("SVD");
    const algoOption = screen.getByText("SVD");
    fireEvent.click(algoOption);

    const dropdownTopic = screen.getByTestId("topic");
    fireEvent.click(dropdownTopic);
    await screen.findAllByText("Clienti")[1];
    const topicOption = screen.getAllByText("Clienti")[1];
    fireEvent.click(topicOption);

    const dropdownTop = screen.getByTestId("top");
    fireEvent.click(dropdownTop);
    await screen.findByText("Top 5");
    const topOption = screen.getByText("Top 5");
    fireEvent.click(topOption);

    const dropdownUsersItems = screen.getByTestId("users-items");
    fireEvent.click(dropdownUsersItems);
    await screen.findByText("CLIENTE 0");
    const usersItemsOption = screen.getByText("CLIENTE 0");
    fireEvent.click(usersItemsOption);

    const ricercaButton = screen.getByTestId("ricerca-button");
    fireEvent.click(ricercaButton);
});
