const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3080;

app.use(cors());
app.use(express.json());

function connectToDB() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: "db",
            user: "myuser",
            password: "mypassword",
            database: "mydatabase",
            port: 3306,
        });
        connection.connect((err) => {
            if (err) {
                console.error("Errore di connessione: ", err);
                reject(err);
            } else {
                console.log("Connesso al DB");
                resolve(connection);
            }
        });
    });
}

// Define routes
app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/login/:use", async (req, res) => {
    const uteUse = req.params.use;
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT use_ute, pas_ute, amm_ute FROM ute WHERE use_ute = ?",
            [uteUse]
        );
        if (results.length === 0) {
            res.status(404).json({
                error: "Utente non trovato",
            });
        } else {
            res.json([results[0]]);
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella utenti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella utenti",
        });
    } finally {
        connection.end();
    }
});

app.get("/users", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT cod_cli, rag_soc FROM anacli"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella users:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella users",
        });
    } finally {
        connection.end();
    }
});

app.get("/users/:id", async (req, res) => {
    const userID = req.params.id;
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT cod_cli, rag_soc FROM anacli WHERE cod_cli = ?",
            [userID]
        );
        if (results.length === 0) {
            res.status(404).json({
                error: "User non trovato",
            });
        } else {
            res.json([results[0]]);
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella clienti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella clienti",
        });
    } finally {
        connection.end();
    }
});

app.get("/items", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT cod_art, des_art FROM anaart"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella prodotti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella prodotti",
        });
    } finally {
        connection.end();
    }
});

app.get("/items/:id", async (req, res) => {
    const itemID = req.params.id;
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT cod_art, des_art FROM anaart WHERE cod_art = ?",
            [itemID]
        );
        if (results.length === 0) {
            res.status(404).json({
                error: "Item non trovato",
            });
        } else {
            res.json([results[0]]);
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella prodotti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella prodotti",
        });
    } finally {
        connection.end();
    }
});

app.get("/categoriaProdotti", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM anaart ORDER BY cod_art"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella prodotti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella prodotti",
        });
    } finally {
        connection.end();
    }
});

app.get("/categoriaClienti", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM anacli JOIN prov ON anacli.cod_prov = prov.cod_prov ORDER BY cod_cli"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella prodotti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella prodotti",
        });
    } finally {
        connection.end();
    }
});

app.get("/userana/:use", async (req, res) => {
    const userID = req.params.use;
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT nom_ute, cog_ute, dat_ute, use_ute, mai_ute, pas_ute FROM ute WHERE use_ute = ?",
            [userID]
        );
        if (results.length === 0) {
            res.status(404).json({
                error: "User non trovato",
            });
        } else {
            results[0].dat_ute = results[0].dat_ute.toISOString().split("T")[0];
            res.json([results[0]]);
        }
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella clienti:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella clienti",
        });
    } finally {
        connection.end();
    }
});

app.put("/userana/:use/email", async (req, res) => {
    const userID = req.params.use;
    const newEmail = req.body.newEmail;

    if (newEmail === null || newEmail === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il nuovo indirizzo email",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "UPDATE ute SET mai_ute = ? WHERE use_ute = ?",
            [newEmail, userID]
        );
        res.status(200).json({
            message: "Indirizzo email aggiornato con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante l'aggiornamento dell'indirizzo email nella tabella utenti:",
            error
        );
        res.status(500).json({
            error: "Errore durante l'aggiornamento dell'indirizzo email nella tabella utenti",
        });
    } finally {
        connection.end();
    }
});

app.put("/userana/:use/password", async (req, res) => {
    const userID = req.params.use;
    const newPassword = req.body.newPassword;

    if (newPassword === null || newPassword === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire la nuova password",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "UPDATE ute SET pas_ute = ? WHERE use_ute = ?",
            [newPassword, userID]
        );
        res.status(200).json({
            message: "Password aggiornata con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante l'aggiornamento della password nella tabella utenti:",
            error
        );
        res.status(500).json({
            error: "Errore durante l'aggiornamento della password nella tabella utenti",
        });
    } finally {
        connection.end();
    }
});

function queryDatabase(connection, query, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server Express in esecuzione sulla porta ${port}`);
    });
}

module.exports = app; // Export the app for testing purposes
