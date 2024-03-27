import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ricerca from "./pages/ricerca";
import Login from "./pages/login";
import Profilo from "./pages/profilo";
import Clienti from "./pages/clienti";
import Prodotti from "./pages/prodotti";
import PaginaNonTrovata from "./pages/paginaNonTrovata";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Ricerca />} />
                <Route path="/ricerca" element={<Ricerca />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profilo" element={<Profilo />} />
                <Route path="/clienti" element={<Clienti />} />
                <Route path="/prodotti" element={<Prodotti />} />
                <Route path="*" element={<PaginaNonTrovata />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
