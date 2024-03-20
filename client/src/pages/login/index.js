import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import logo from "../../assets/images/logo.png";
import Footer from "../../components/Footer";

const expressUrl = process.env.EXPRESS_API_URL || "localhost:3080";

function Login() {
    const [username, setUsername] = useState("");
    const [errUsername, setErrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errPassword, setErrPassword] = useState("");

    const [errLogin, setErrLogin] = useState("");

    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    });

    async function proceedLogin(e) {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.get(
                    `http://${expressUrl}/login/${username}`
                );
                if (response.status !== 200) {
                    setErrLogin("Errore! Inserisci un username valido");
                } else {
                    if (
                        bcrypt.compareSync(password, response.data[0].pas_ute)
                    ) {
                        sessionStorage.setItem("username", username);
                        sessionStorage.setItem(
                            "amministratore",
                            response.data[0].amm_ute
                        );
                        usenavigate("/");
                    } else {
                        setErrLogin(
                            "Errore! Inserisci delle credenziali valide"
                        );
                    }
                }
            } catch (error) {
                if (error.response.status === 404) {
                    setErrLogin("Errore! Inserisci un username valido");
                } else {
                    setErrLogin("Errore durante la richiesta: ", error);
                }
            }
        }
    }

    function validate() {
        let result = true;
        if (username === "" || username === null) {
            result = false;
            setErrUsername("Il campo username non può essere vuoto");
        }
        if (password === "" || password === null) {
            result = false;
            setErrPassword("Il campo password non può essere vuoto");
        }
        return result;
    }

    return (
        <>
            <div className="h-screen p-2 flex flex-col gap-2">
                <div className="h-full flex items-center justify-center flex-col gap-2">
                    <div>
                        <img src={logo} alt="logo"></img>
                    </div>
                    {errLogin && (
                        <label className="block text-sm font-medium leading-6 text-red-500">
                            {errLogin}
                        </label>
                    )}
                    <form
                        className="space-y-4"
                        data-testid="login-form"
                        onSubmit={proceedLogin}
                    >
                        <div className="mt-2">
                            <label
                                htmlFor="username"
                                className="block text-md font-medium leading-6"
                            >
                                Username
                            </label>
                            <div>
                                <InputText
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    className="w-72"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setErrUsername("");
                                    }}
                                />
                            </div>
                            {errUsername && (
                                <label className="block text-sm font-medium leading-6 text-red-500">
                                    {errUsername}
                                </label>
                            )}
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-md font-medium leading-6"
                            >
                                Password
                            </label>
                            <div>
                                <Password
                                    inputId="password"
                                    toggleMask
                                    feedback={false}
                                    placeholder="Password"
                                    inputClassName="w-72"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrPassword("");
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                            {errPassword && (
                                <label className="block text-sm font-medium leading-6 text-red-500">
                                    {errPassword}
                                </label>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button label="Accedi"></Button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Login;
