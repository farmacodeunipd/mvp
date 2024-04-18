import "@testing-library/jest-dom/extend-expect";
import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";
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

test("onFetchResult SVD user chiamata correttamente", async () => {
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

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("SVD");
    const algoOption = screen.getByText("SVD");
    fireEvent.click(algoOption);

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

    expect(mockFetchResults).toHaveBeenCalledWith("SVD", "user", 1, "5");
});

test("onFetchResult NN user chiamata correttamente", async () => {
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

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("NN");
    const algoOption = screen.getByText("NN");
    fireEvent.click(algoOption);

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

    expect(mockFetchResults).toHaveBeenCalledWith("NN", "user", 1, "5");
});

test("onFetchResult SVD item chiamata correttamente", async () => {
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

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("SVD");
    const algoOption = screen.getByText("SVD");
    fireEvent.click(algoOption);

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

    expect(mockFetchResults).toHaveBeenCalledWith("SVD", "item", "A123", "5");
});

test("onFetchResult NN item chiamata correttamente", async () => {
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

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("NN");
    const algoOption = screen.getByText("NN");
    fireEvent.click(algoOption);

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

    expect(mockFetchResults).toHaveBeenCalledWith("NN", "item", "A123", "5");
});

test("training button disabled", () => {
    sessionStorage.setItem("amministratore", 1);
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    const trainingButton = screen.getByTestId("training-button");
    expect(trainingButton).toHaveAttribute("disabled");
});

test("training button not disabled", async () => {
    sessionStorage.setItem("amministratore", 1);
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("NN");
    const algoOption = screen.getByText("NN");
    fireEvent.click(algoOption);

    const trainingButton = screen.getByTestId("training-button");
    expect(trainingButton).not.toHaveAttribute('disabled=""');
});

test("no training button in the page", () => {
    sessionStorage.setItem("amministratore", 0);
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    expect(screen.queryByTestId("training-button")).not.toBeInTheDocument();
});

test("test training confermation dialog visibility", async () => {
    sessionStorage.setItem("amministratore", 1);
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("NN");
    const algoOption = screen.getByText("NN");
    fireEvent.click(algoOption);

    const trainingButton = screen.getByTestId("training-button");
    fireEvent.click(trainingButton);

    await waitFor(() => {
        const dialog = screen.getByTestId("dialog");
        expect(dialog).toBeInTheDocument();
        const dialogTitle = within(dialog).getByText("Warning");
        expect(dialogTitle).toBeInTheDocument();
    });
});

test("test training confermation dialog loading", async () => {
    sessionStorage.setItem("amministratore", 1);
    render(
        <Filter
            onFetchResults={() => {}}
            users={[]}
            items={[]}
            onObjectChange={() => {}}
        />
    );

    const dropdownAlgo = screen.getByTestId("algo");
    fireEvent.click(dropdownAlgo);
    await screen.findByText("NN");
    const algoOption = screen.getByText("NN");
    fireEvent.click(algoOption);

    const trainingButton = screen.getByTestId("training-button");
    fireEvent.click(trainingButton);

    await waitFor(() => {
        const dialog = screen.getByTestId("dialog");
        expect(dialog).toBeInTheDocument();
        const dialogTitle = within(dialog).getByText("Warning");
        expect(dialogTitle).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId("confirm-training-button");
    fireEvent.click(confirmButton);

    await waitFor(() => {
        const dialog = screen.getByTestId("dialog");
        expect(dialog).toBeInTheDocument();
        const dialogTitle = within(dialog).getByText("Loading");
        expect(dialogTitle).toBeInTheDocument();
    });
});
