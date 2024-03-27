import React from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import Footer from "../../components/Footer";

function PaginaNonTrovata() {
    return (
        <>
            <div className="h-screen p-2 flex flex-col gap-2">
                <div className="h-full flex items-center justify-center flex-col gap-2">
                    <div className="text-9xl">404</div>
                    <div className="mb-2">Sembra che ti sei perso.</div>
                    <Link to="/">
                        <Button label="Torna alla home" />
                    </Link>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default PaginaNonTrovata;
