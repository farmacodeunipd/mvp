import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Layout = () => {
    const usenavigate = useNavigate();
    const location =useLocation();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            usenavigate("/login");
        }
    });
    
    return (
        <>
            <div className="p-4 bg-white dark:bg-gray-950 h-screen space-y-4 flex flex-col">
                <header
                    data-testid="header"
                    className="bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg flex justify-between items-center"
                >
                    <nav className="flex">
                        <ul className="flex">
                            <li className="ml-12">
                                <Link to="/" className={`text-lg py-3 px-3 mr-5 text-black font-bold ${location.pathname === '/' ? 'no-underline' : 'cursor-pointer underline decoration-[3px] underline-offset-4 hover:no-underline'}`}  >
                                    Home
                                </Link>
                            </li>
                            <li className="float-left">
                                <Link to="/profilo" className={`text-lg py-3 px-3 mr-5 text-black font-bold ${location.pathname === '/profilo' ? 'no-underline' : 'cursor-pointer underline decoration-[3px] underline-offset-4 hover:no-underline'}`}>
                                    Profilo
                                </Link>
                            </li>
                            <li className="float-left">
                                <Link to="/catprod" className={`text-lg py-3 px-3 mr-5 text-black font-bold ${location.pathname === '/catprod' ? 'no-underline' : 'cursor-pointer underline decoration-[3px] underline-offset-4 hover:no-underline'}`}>
                                    Catalogo Prodotti
                                </Link>
                            </li>
                            <li className="float-left">
                                <Link to="/catcli" className={`text-lg py-3 px-3 text-black font-bold ${location.pathname === '/catcli' ? 'no-underline' : 'cursor-pointer underline decoration-[3px] underline-offset-4 hover:no-underline'}`}>
                                    Catalogo Clienti
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="mr-12">
                        <img src={logo} alt="logo"></img>
                    </div>
                </header>

                <Outlet />
            </div>
        </>
    );
};

export default Layout;
