import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Divider } from "primereact/divider";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Profilo() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        }
    });

    const [userData, setuserData] = useState(null);
    useEffect(() => {
        let username = sessionStorage.getItem("username");
        getUserData(username);
    }, []);

    async function getUserData(username) {
        const response = await axios.get(
            `http://${expressUrl}/userana/${username}`
        );
        setuserData(response.data[0]);
    }

    const ptDivider = {
        root: {
            className: "!my-3 before:!border-gray-300",
        },
    };

    return (
        <>
            <div className="h-screen p-2 flex flex-col gap-2">
                <Header />
                <div className="h-full flex flex-col gap-4 rounded-3xl p-4 bg-white border border-gray-300">
                    <div>
                        <h1 className="text-black text-2xl font-semibold">
                            Profilo utente
                        </h1>
                        <p className="text-sm text-gray-800">
                            Di seguito vedrai le informazioni che abbiamo su di
                            te.
                        </p>
                    </div>
                    {userData ? (
                        <div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Nome
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.nom_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Cognome
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.cog_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Data di nascita
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.dat_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Username
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.use_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Email
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.mai_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex justify-between">
                                <p className="text-md text-black font-medium">
                                    Password
                                </p>
                                <p className="text-md text-gray-800">
                                    {userData.pas_ute}
                                </p>
                                <p>Modifica</p>
                            </div>
                        </div>
                    ) : null}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Profilo;
