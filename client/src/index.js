import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Profilo from "./pages/Profilo";
import CatProd from "./pages/CatProd";
import CatCli from "./pages/CatCli";

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profilo" element={<Profilo />} />
            <Route path="catprod" element={<CatProd />} />
            <Route path="catcli" element={<CatCli />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
