import React from "react";
import logo from "../assets/images/logo.png";

function Header() {
    return (
        <>
            <header data-testid="header" className="bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg flex justify-center items-center">
                <div>
                    <img src={logo} alt="logo"></img>
                </div>
            </header>
        </>
    );
}

export default Header;
