import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "../pages/login";

jest.mock("axios");

const originalConsoleError = console.error;
const jsDomCssError = "Error: Could not parse CSS stylesheet";
console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
        originalConsoleError(...params);
    }
};

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

test("render footer components in Login", () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
});

test("render form in Login", () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
    const footerElement = screen.getByTestId("login-form");
    expect(footerElement).toBeInTheDocument();
});

test("test funzione validate() in Login", () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    act(() => {
        userEvent.click(screen.getByText("Accedi"));
    });

    expect(
        screen.getByText("Il campo username non può essere vuoto")
    ).toBeInTheDocument();
    expect(
        screen.getByText("Il campo password non può essere vuoto")
    ).toBeInTheDocument();
});

test("test successful login", async () => {
    const mockedResponse = {
        status: 200,
        data: [
            {
                use_ute: "a",
                pas_ute:
                    "$2a$10$LDpvuJQOfj9b1.fvjeW5Bu/C7BJlGMCtEh0j4o2N62Za.4Uz/0h72",
                amm_ute: 1,
            },
        ],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    await act(async () => {
        userEvent.type(screen.getByLabelText("Username"), "a");
        userEvent.type(screen.getByLabelText("Password"), "a");
        userEvent.click(screen.getByText("Accedi"));
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                `http://${expressUrl}/login/a`
            );
        });
    });

    await waitFor(() => {
        expect(window.location.pathname).toEqual("/");
    });
});

test("test 404 message", async () => {
    const mockedResponse = {
        status: 404,
        data: [{}],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    await act(async () => {
        userEvent.type(screen.getByLabelText("Username"), "c");
        userEvent.type(screen.getByLabelText("Password"), "c");
        userEvent.click(screen.getByText("Accedi"));
    });

    await waitFor(() => {
        expect(
            screen.getByText("Errore! Inserisci un username valido")
        ).toBeInTheDocument();
    });
});

test("test credenziali errate message", async () => {
    const mockedResponse = {
        status: 200,
        data: [{ use_ute: "a", pas_ute: "c", amm_ute: 1 }],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    await act(async () => {
        userEvent.type(screen.getByLabelText("Username"), "c");
        userEvent.type(screen.getByLabelText("Password"), "c");
        userEvent.click(screen.getByText("Accedi"));
    });

    await waitFor(() => {
        expect(
            screen.getByText("Errore! Inserisci delle credenziali valide")
        ).toBeInTheDocument();
    });
});
