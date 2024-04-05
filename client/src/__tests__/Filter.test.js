import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Filter from "../components/Filter";

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

test("render filter component", () => {
    const mockFetchResults = jest.fn();
    const mockObjectChange = jest.fn();
    const users = [
        { cod_cli: 1, rag_soc: "Cliente 1" },
        { cod_cli: 2, rag_soc: "Cliente 2" },
    ];
    const items = [
        { cod_art: "A123", des_art: "Prodotto 1" },
        { cod_art: "B456", des_art: "Prodotto 2" },
    ];

    render(
        <Filter
            onFetchResults={mockFetchResults}
            users={users}
            items={items}
            onObjectChange={mockObjectChange}
        />
    );
});

test("button disabled", () => {
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    const ricercaButton = screen.getByTestId("ricerca-button");
    expect(ricercaButton).toHaveAttribute("disabled");
});

test("button not disabled", async () => {
    const mockFetchResults = jest.fn();
    const mockObjectChange = jest.fn();
    const users = [
        { cod_cli: 1, rag_soc: "Cliente 1" },
        { cod_cli: 2, rag_soc: "Cliente 2" },
    ];
    const items = [
        { cod_art: "A123", des_art: "Prodotto 1" },
        { cod_art: "B456", des_art: "Prodotto 2" },
    ];

    render(
        <Filter
            onFetchResults={mockFetchResults}
            users={users}
            items={items}
            onObjectChange={mockObjectChange}
        />
    );

    const dropdownTopic = screen.getByTestId("topic");
    fireEvent.click(dropdownTopic);
    await screen.findByText("Clienti");
    const topicOption = screen.getByText("Clienti");
    fireEvent.click(topicOption);

    const dropdownTop = screen.getByTestId("top");
    fireEvent.click(dropdownTop);
    await screen.findByText("Top 5");
    const topOption = screen.getByText("Top 5");
    fireEvent.click(topOption);

    const dropdownUsersItems = screen.getByTestId("users-items");
    fireEvent.click(dropdownUsersItems);
    await screen.findByText("Cliente 1");
    const usersItemsOption = screen.getByText("Cliente 1");
    fireEvent.click(usersItemsOption);

    const ricercaButton = screen.getByTestId("ricerca-button");
    expect(ricercaButton).not.toHaveAttribute('disabled=""');
});

test("onFetchResult user chiamata correttamente", async () => {
    const mockFetchResults = jest.fn();
    const mockObjectChange = jest.fn();
    const users = [
        { cod_cli: 1, rag_soc: "Cliente 1" },
        { cod_cli: 2, rag_soc: "Cliente 2" },
    ];
    const items = [
        { cod_art: "A123", des_art: "Prodotto 1" },
        { cod_art: "B456", des_art: "Prodotto 2" },
    ];

    render(
        <Filter
            onFetchResults={mockFetchResults}
            users={users}
            items={items}
            onObjectChange={mockObjectChange}
        />
    );

    const dropdownTopic = screen.getByTestId("topic");
    fireEvent.click(dropdownTopic);
    await screen.findByText("Clienti");
    const topicOption = screen.getByText("Clienti");
    fireEvent.click(topicOption);

    const dropdownTop = screen.getByTestId("top");
    fireEvent.click(dropdownTop);
    await screen.findByText("Top 5");
    const topOption = screen.getByText("Top 5");
    fireEvent.click(topOption);

    const dropdownUsersItems = screen.getByTestId("users-items");
    fireEvent.click(dropdownUsersItems);
    await screen.findByText("Cliente 1");
    const usersItemsOption = screen.getByText("Cliente 1");
    fireEvent.click(usersItemsOption);

    const ricercaButton = screen.getByTestId("ricerca-button");
    fireEvent.click(ricercaButton);

    expect(mockFetchResults).toHaveBeenCalledWith("user", 1, "5");
});

test("onFetchResult item chiamata correttamente", async () => {
    const mockFetchResults = jest.fn();
    const mockObjectChange = jest.fn();
    const users = [
        { cod_cli: 1, rag_soc: "Cliente 1" },
        { cod_cli: 2, rag_soc: "Cliente 2" },
    ];
    const items = [
        { cod_art: "A123", des_art: "Prodotto 1" },
        { cod_art: "B456", des_art: "Prodotto 2" },
    ];

    render(
        <Filter
            onFetchResults={mockFetchResults}
            users={users}
            items={items}
            onObjectChange={mockObjectChange}
        />
    );

    const dropdownTopic = screen.getByTestId("topic");
    fireEvent.click(dropdownTopic);
    await screen.findByText("Prodotti");
    const topicOption = screen.getByText("Prodotti");
    fireEvent.click(topicOption);

    const dropdownTop = screen.getByTestId("top");
    fireEvent.click(dropdownTop);
    await screen.findByText("Top 5");
    const topOption = screen.getByText("Top 5");
    fireEvent.click(topOption);

    const dropdownUsersItems = screen.getByTestId("users-items");
    fireEvent.click(dropdownUsersItems);
    await screen.findByText("Prodotto 1");
    const usersItemsOption = screen.getByText("Prodotto 1");
    fireEvent.click(usersItemsOption);

    const ricercaButton = screen.getByTestId("ricerca-button");
    fireEvent.click(ricercaButton);

    expect(mockFetchResults).toHaveBeenCalledWith("item", "A123", "5");
});
