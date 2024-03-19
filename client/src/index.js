import React from "react";
import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import App from "./App";

import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
);
