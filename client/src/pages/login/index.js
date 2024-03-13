import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
                    if (response.data[0].pas_ute === password) {
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
            <div className="p-4 bg-white dark:bg-gray-950 h-screen space-y-4 flex flex-col">
                <div className="bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg flex justify-center items-center">
                    <div>
                        <img src={logo} alt="logo"></img>
                    </div>
                </div>
                <div className="p-4 space-y-4 bg-gray-200 dark:bg-gray-900 rounded-3xl shadow-lg h-full flex flex-col justify-center overflow-hidden">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="text-center text-3xl font-bold leading-9 tracking-tight  dark:text-white text-gray-900">
                            Accedi con il tuo account
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        {errLogin && (
                            <label className="block text-sm font-medium leading-6 text-red-900 dark:text-red-500">
                                {errLogin}
                            </label>
                        )}
                        <form className="space-y-6" onSubmit={proceedLogin}>
                            <div>
                                <label className="block text-md font-medium leading-6 text-gray-900 dark:text-white">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 sm:text-sm sm:leading-6"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setErrUsername("");
                                        }}
                                    />
                                </div>
                                {errUsername && (
                                    <label className="block text-sm font-medium leading-6 text-red-900 dark:text-red-500">
                                        {errUsername}
                                    </label>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-md font-medium leading-6 text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="block w-full rounded-md border-0 py-1.5 px-1.5 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 sm:text-sm sm:leading-6"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrPassword("");
                                        }}
                                    />
                                </div>
                                {errPassword && (
                                    <label className="block text-sm font-medium leading-6 text-red-900 dark:text-red-500">
                                        {errPassword}
                                    </label>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
                                >
                                    Accedi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        </>
    );
}

export default Login;
