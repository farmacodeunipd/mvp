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

app.get("/users", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(connection, "SELECT cod_cli, rag_soc FROM anacli LIMIT 500");
        res.json(results);
    } catch (error) {
        console.error("Errore durante il recupero dei dati dalla tabella users:", error);
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
        const results = await queryDatabase(connection, "SELECT cod_cli, rag_soc FROM anacli WHERE cod_cli = ?", [userID]);
        if (results.length === 0) {
            res.status(404).json({
                error: "User non trovato",
            });
        } else {
            res.json([results[0]]);
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dati dalla tabella clienti:", error);
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
        const results = await queryDatabase(connection, "SELECT cod_art, des_art FROM anaart LIMIT 500");
        res.json(results);
    } catch (error) {
        console.error("Errore durante il recupero dei dati dalla tabella prodotti:", error);
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
        const results = await queryDatabase(connection, "SELECT cod_art, des_art FROM anaart WHERE cod_art = ?", [itemID]);
        if (results.length === 0) {
            res.status(404).json({
                error: "Item non trovato",
            });
        } else {
            res.json([results[0]]);
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dati dalla tabella prodotti:", error);
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella prodotti",
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

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server Express in esecuzione sulla porta ${port}`);
    });
}

module.exports = app; // Export the app for testing purposes
