import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Profilo from "../pages/profilo";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

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

test("stampa dati corretti", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "mrossi",
        mai_ute: "mario.rossi@example.com",
    };

    axios.get.mockResolvedValueOnce({ data: [userData] });

    await act(async () => {
        sessionStorage.setItem("username", "mrossi");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    expect(screen.getByDisplayValue(userData.nom_ute)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userData.cog_ute)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userData.dat_ute)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userData.use_ute)).toBeInTheDocument();
    expect(screen.getByDisplayValue(userData.mai_ute)).toBeInTheDocument();
});

test("salvataggio con successo della mail", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        axios.put.mockResolvedValueOnce({});
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newEmail = "new.email@example.com";
    const editEmailButton = screen.getByTestId("edit-email-button");
    fireEvent.click(editEmailButton);
    const emailInput = screen.getByDisplayValue(userData.mai_ute);
    fireEvent.change(emailInput, { target: { value: newEmail } });

    const saveButton = screen.getByTestId("save-email-button");
    fireEvent.click(saveButton);

    await waitFor(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/userana/${userData.use_ute}/email`,
            { newEmail }
        );
    });
    expect(screen.getByDisplayValue(newEmail)).toBeInTheDocument();
});

test("salvataggio con successo della password", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        axios.put.mockResolvedValueOnce({});
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newPassword = "12345";
    const editPasswordButton = screen.getByTestId("edit-password-button");
    fireEvent.click(editPasswordButton);
    const passwordInput = screen.getByPlaceholderText("Nuova password");
    fireEvent.change(passwordInput, { target: { value: newPassword } });

    const saveButton = screen.getByTestId("save-password-button");
    fireEvent.click(saveButton);

    await waitFor(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining(`/userana/${userData.use_ute}/password`),
            expect.any(Object)
        );
    });
});

test("test correct 400 message error for email", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        // axios.put.mockImplementationOnce(() => Promise.resolve());
        axios.put.mockRejectedValueOnce({ response: { status: 400 } });
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newEmail = "";
    const editEmailButton = screen.getByTestId("edit-email-button");
    fireEvent.click(editEmailButton);

    const emailInput = screen.getByDisplayValue(userData.mai_ute);
    fireEvent.change(emailInput, { target: { value: newEmail } });

    const saveButton = screen.getByTestId("save-email-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/userana/${userData.use_ute}/email`,
            { newEmail }
        );

        const errorElement = screen.getByTestId("error-new-email");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(
            "Il campo email non può essere vuoto."
        );
    });
});

test("test correct 400 message error for password", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        // axios.put.mockImplementationOnce(() => Promise.resolve());
        // axios.put.mockRejectedValueOnce({ response: { status: 400 } });
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newPassword = "";
    const editPasswordButton = screen.getByTestId("edit-password-button");
    fireEvent.click(editPasswordButton);

    const passwordInput = screen.getByPlaceholderText("Nuova password");
    fireEvent.change(passwordInput, { target: { value: newPassword } });

    const saveButton = screen.getByTestId("save-password-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
        const errorElement = screen.getByTestId("error-new-password");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(
            "Il campo password non può essere vuoto."
        );
    });
});

test("test correct 500 message error for email", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        // axios.put.mockImplementationOnce(() => Promise.resolve());
        axios.put.mockRejectedValueOnce({ response: { status: 500 } });
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newEmail = "";
    const editEmailButton = screen.getByTestId("edit-email-button");
    fireEvent.click(editEmailButton);

    const emailInput = screen.getByDisplayValue(userData.mai_ute);
    fireEvent.change(emailInput, { target: { value: newEmail } });

    const saveButton = screen.getByTestId("save-email-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
            `http://${expressUrl}/userana/${userData.use_ute}/email`,
            { newEmail }
        );

        const errorElement = screen.getByTestId("error-new-email");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(
            "Errore! Ricontrolla l'email inserita, potrebbe essere gia inserita nei nostri sistemi."
        );
    });
});

test("test correct 500 message error for password", async () => {
    const userData = {
        nom_ute: "Mario",
        cog_ute: "Rossi",
        dat_ute: "1990-01-01",
        use_ute: "a",
        mai_ute: "mario.rossi@example.com",
    };

    await act(async () => {
        axios.get.mockResolvedValue({ data: [userData] });
        // axios.put.mockImplementationOnce(() => Promise.resolve());
        axios.put.mockRejectedValueOnce({ response: { status: 500 } });
    });

    await act(async () => {
        sessionStorage.setItem("username", "a");
        render(
            <BrowserRouter>
                <Profilo />
            </BrowserRouter>
        );
    });

    const newPassword = "password";
    const editPasswordButton = screen.getByTestId("edit-password-button");
    fireEvent.click(editPasswordButton);

    const passwordInput = screen.getByPlaceholderText("Nuova password");
    fireEvent.change(passwordInput, { target: { value: newPassword } });

    const saveButton = screen.getByTestId("save-password-button");
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining(`/userana/${userData.use_ute}/password`),
            expect.any(Object)
        );

        const errorElement = screen.getByTestId("error-new-password");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent(
            "Errore! Ricontrolla la password inserita."
        );
    });
});
