import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Profilo() {
    const navigate = useNavigate();

    useEffect(() => {
        let username = sessionStorage.getItem("username");
        if (username === "" || username === null) {
            navigate("/login");
        } else {
            getUserData(username);
        }
    }, []);

    const [userData, setUserData] = useState(null);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function getUserData(username) {
        const response = await axios.get(
            `http://${expressUrl}/userana/${username}`
        );
        setUserData(response.data[0]);
        setNewEmail(response.data[0].mai_ute);
    }

    const [editModeEmail, setEditModeEmail] = useState(false);
    const [editModePassword, setEditModePassword] = useState(false);

    async function saveNewEmail() {
        try {
            await axios.put(
                `http://${expressUrl}/userana/${userData.use_ute}/email`,
                { newEmail }
            );
            setEditModeEmail(false);
            getUserData(userData.use_ute);
        } catch (error) {
            console.error("Errore durante il salvataggio dell'email:", error);
            // Gestisci l'errore qui
        }
    }

    async function saveNewPassword() {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await axios.put(
                `http://${expressUrl}/userana/${userData.use_ute}/password`,
                { newPassword: hashedPassword }
            );
            setEditModePassword(false);
            getUserData(userData.use_ute);
        } catch (error) {
            console.error(
                "Errore durante l'aggiornamento della password:",
                error
            );
            // Gestisci l'errore qui
        }
    }

    const ptDivider = {
        root: {
            className: "!my-4 before:!border-gray-300",
        },
    };

    const ptButton = {
        root: {
            className: "!px-3 !py-1",
        },
    };

    const ptButtonIcon = {
        root: {
            className: "!p-1",
        },
        icon: {
            className: "!w-8 !h-8 text-2xl",
        },
        tooltip: {
            root: {
                className: "!shadow-none",
            },
            text: {
                className: "!p-1",
            },
        },
    };

    const ptInput = {
        root: {
            className:
                "!pl-0 !py-2 !pr-2 !border-white hover:!border-white dark:focus:!shadow-none focus:!shadow-none !text-md !text-gray-800",
        },
    };

    const ptInputEditable = {
        root: {
            className: "!p-2 !text-md !text-gray-800",
        },
    };

    const ptPassword = {
        input: {
            className:
                "!pl-0 !py-2 !pr-2 !border-0 dark:focus:!shadow-none focus:!shadow-none !text-md !text-gray-800",
        },
    };

    const ptPasswordEditable = {
        input: {
            className: "!p-2 !text-md !text-gray-800",
        },
    };

    return (
        <>
            <div className="h-screen p-2 flex flex-col gap-2">
                <Header />
                <div className="h-full flex flex-col gap-4 rounded-3xl p-4 bg-white border border-gray-300">
                    <div className="">
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
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Nome
                                </p>
                                <InputText
                                    value={userData.nom_ute}
                                    pt={ptInput}
                                    readOnly
                                />
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Cognome
                                </p>
                                <InputText
                                    value={userData.cog_ute}
                                    pt={ptInput}
                                    readOnly
                                />
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Data di nascita
                                </p>
                                <InputText
                                    value={userData.dat_ute}
                                    pt={ptInput}
                                    readOnly
                                />
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Username
                                </p>
                                <InputText
                                    value={userData.use_ute}
                                    pt={ptInput}
                                    readOnly
                                />
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Email
                                </p>
                                <InputText
                                    value={
                                        editModeEmail
                                            ? newEmail
                                            : userData.mai_ute
                                    }
                                    onChange={(e) =>
                                        setNewEmail(e.target.value)
                                    }
                                    pt={
                                        editModeEmail
                                            ? ptInputEditable
                                            : ptInput
                                    }
                                    keyfilter="email"
                                    readOnly={!editModeEmail}
                                    className="w-1/5"
                                />
                                <div className="w-2/5 flex justify-end gap-3">
                                    {editModeEmail ? (
                                        <Button
                                            severity="success"
                                            pt={ptButton}
                                            label="Salva"
                                            onClick={saveNewEmail}
                                        />
                                    ) : null}
                                    <Button
                                        icon={
                                            editModeEmail
                                                ? "pi pi-times"
                                                : "pi pi-pencil"
                                        }
                                        severity={
                                            editModeEmail ? "danger" : "info"
                                        }
                                        pt={ptButtonIcon}
                                        onClick={() => {
                                            if (editModeEmail) {
                                                setNewEmail(userData.mai_ute);
                                            }
                                            setEditModeEmail(!editModeEmail);
                                        }}
                                    />
                                </div>
                            </div>
                            <Divider pt={ptDivider} />
                            <div className="flex items-center">
                                <p className="w-2/5 text-md text-black font-medium">
                                    Password
                                </p>
                                <div className="w-1/5">
                                    <Password
                                        value={
                                            editModePassword
                                                ? newPassword
                                                : "********"
                                        }
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Nuova password"
                                        pt={
                                            editModePassword
                                                ? ptPasswordEditable
                                                : ptPassword
                                        }
                                        readOnly={!editModePassword}
                                        feedback={false}
                                        toggleMask={editModePassword}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="w-2/5 flex justify-end gap-3">
                                    {editModePassword ? (
                                        <Button
                                            severity="success"
                                            pt={ptButton}
                                            label="Salva"
                                            onClick={saveNewPassword}
                                        />
                                    ) : null}
                                    <Button
                                        icon={
                                            editModePassword
                                                ? "pi pi-times"
                                                : "pi pi-pencil"
                                        }
                                        severity={
                                            editModePassword ? "danger" : "info"
                                        }
                                        pt={ptButtonIcon}
                                        onClick={() => {
                                            if (editModePassword) {
                                                setNewPassword("");
                                            }
                                            setEditModePassword(
                                                !editModePassword
                                            );
                                        }}
                                    />
                                </div>
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
