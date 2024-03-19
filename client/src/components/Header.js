import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menubar } from "primereact/menubar";

import logo from "../assets/images/logo.png";

function Header() {
    const location = useLocation();

    const itemRenderer = (item) => (
        <Link
            key={item.id}
            to={item.link}
            className="flex align-items-center p-menuitem-link rounded-md !py-3 !px-5  hover:bg-gray-200 text-black"
        >
            <span className={item.icon} />
            <span
                className={`mx-2 ${
                    location.pathname === item.link ? "underline" : ""
                } ${
                    location.pathname === "/" && item.link === "/ricerca"
                        ? "underline"
                        : ""
                }`}
            >
                {item.label}
            </span>
        </Link>
    );

    const items = [
        {
            id: 1,
            label: "Ricerca",
            icon: "pi pi-search",
            link: "/ricerca",
            template: itemRenderer,
        },
        {
            id: 2,
            label: "Clienti",
            icon: "pi pi-users",
            link: "/clienti",
            template: itemRenderer,
        },
        {
            id: 3,
            label: "Prodotti",
            icon: "pi pi-box",
            link: "/prodotti",
            template: itemRenderer,
        },
        {
            id: 4,
            label: "Profilo",
            icon: "pi pi-user",
            link: "/profilo",
            template: itemRenderer,
        },
    ];

    const start = <img src={logo} alt="logo"></img>;

    const end = (
        <Link
            to="/login"
            className="flex align-items-center rounded-md !py-3 !px-5 text-black hover:bg-red-500 hover:text-white"
        >
            <span className="pi pi-sign-out"></span>
            <span className="mx-2">Logout</span>
        </Link>
    );

    return (
        <>
            <Menubar
                model={items}
                start={start}
                end={end}
                className="!rounded-3xl bg-white"
            />
        </>
    );
}

export default Header;
