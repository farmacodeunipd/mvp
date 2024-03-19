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
        data: [{ use_ute: "a", pas_ute: "a", amm_ute: 1 }],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );

    // act(() => {
    //     userEvent.click(screen.getByText("Accedi"));
    // });

    // expect(axios.get).toHaveBeenCalledWith("http://localhost:3080/login/a");

    await act(async () => {
        userEvent.type(screen.getByLabelText("Username"), "a");
        userEvent.type(screen.getByLabelText("Password"), "a");
        userEvent.click(screen.getByText("Accedi"));
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                "http://express:3080/login/a"
            );
        });
    });

    await waitFor(() => {
        expect(window.location.pathname).toEqual("/");
    });
});
