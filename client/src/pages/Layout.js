import { Outlet, Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Layout = () => {
    return (
        <>
            <div className="p-4 bg-white dark:bg-gray-950 h-screen space-y-4 flex flex-col">
                <header data-testid="header" className="bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg flex justify-center items-center">
                    <nav>
                        <ul>
                            <li className="float-left">
                                <Link to="/" className="py-14 px-16">Home</Link>
                            </li>
                            <li className="float-left">
                                <Link to="/profilo" className="py-14 px-16">Profilo</Link>
                            </li>
                            <li className="float-left">
                                <Link to="/catprod" className="py-14 px-16">Catalogo Prodotti</Link>
                            </li>
                            <li className="float-left">
                                <Link to="/catcli" className="py-14 px-16">Catalogo Clienti</Link>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        <img src={logo} alt="logo"></img>
                    </div>
                </header>

                <Outlet />
            </div>
        </>
    )
    };

export default Layout;