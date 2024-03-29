import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

// test("salvataggio con successo della mail", async () => {
//     const userData = {
//         nom_ute: "Mario",
//         cog_ute: "Rossi",
//         dat_ute: "1990-01-01",
//         use_ute: "a",
//         mai_ute: "mario.rossi@example.com",
//     };

//     axios.get.mockResolvedValueOnce({ data: [userData] });
//     axios.put.mockResolvedValueOnce({});

//     await act(async () => {
//         sessionStorage.setItem("username", "a");
//         render(
//             <BrowserRouter>
//                 <Profilo />
//             </BrowserRouter>
//         );
//     });

//     const newEmail = "new.email@example.com";
//     const editEmailButton = screen.getByTestId("edit-email-button");
//     fireEvent.click(editEmailButton);
//     const emailInput = screen.getByDisplayValue(userData.mai_ute);
//     fireEvent.change(emailInput, { target: { value: newEmail } });

//     const saveButton = screen.getByTestId("save-email-button");
//     fireEvent.click(saveButton);

//     expect(axios.put).toHaveBeenCalledWith(
//         `http://localhost:3080/userana/${userData.use_ute}/email`,
//         { newEmail }
//     );
//     expect(axios.get).toHaveBeenCalledTimes(2);
// });
