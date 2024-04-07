const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3080;
const hostname = process.env.DB_HOSTNAME || "localhost";

app.use(cors());
app.use(express.json());

function connectToDB() {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: hostname,
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

app.get("/prodotti", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM anaart LEFT JOIN linee_comm ON anaart.cod_linea_comm = linee_comm.cod_linea_comm LEFT JOIN settori_comm ON anaart.cod_sett_comm = settori_comm.cod_sett_comm LEFT JOIN famiglie_comm ON anaart.cod_fam_comm = famiglie_comm.cod_fam_comm LEFT JOIN sottofamiglie_comm ON anaart.cod_sott_comm = sottofamiglie_comm.cod_sott_comm ORDER BY cod_art"
        );
        const formattedResults = results.map((result) => ({
            cod_art: result.cod_art,
            des_art: result.des_art,
            lineecomm: {
                cod_linea_comm: result.cod_linea_comm,
                linea_comm: result.linea_comm,
            },
            settoricomm: {
                cod_sett_comm: result.cod_sett_comm,
                sett_comm: result.sett_comm,
            },
            famigliecomm: {
                cod_fam_comm: result.cod_fam_comm,
                fam_comm: result.fam_comm,
            },
            sottofamigliecomm: {
                cod_sott_comm: result.cod_sott_comm,
                sott_comm: result.sott_comm,
            },
            img_path: result.image_path,
        }));
        res.json(formattedResults);
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

app.get("/prodotti/lineecommerciali", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM linee_comm"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella linee commerciali:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella linee commerciali",
        });
    } finally {
        connection.end();
    }
});

app.get("/prodotti/settoricommerciali", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM settori_comm"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella linee commerciali:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella linee commerciali",
        });
    } finally {
        connection.end();
    }
});

app.get("/prodotti/famigliecommerciali", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM famiglie_comm"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella famiglie commerciali:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella famiglie commerciali",
        });
    } finally {
        connection.end();
    }
});

app.get("/prodotti/sottofamigliecommerciali", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM sottofamiglie_comm"
        );
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella sottofamiglie commerciali:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella sottofamiglie commerciali",
        });
    } finally {
        connection.end();
    }
});

app.get("/clienti", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(
            connection,
            "SELECT * FROM anacli JOIN tabprov ON anacli.cod_prov = tabprov.cod_prov ORDER BY cod_cli"
        );
        const formattedResults = results.map((result) => ({
            cod_cli: result.cod_cli,
            rag_soc: result.rag_soc,
            prov: {
                cod_prov: result.cod_prov,
                des_prov: result.des_prov,
            },
        }));
        res.json(formattedResults);
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

app.get("/clienti/province", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(connection, "SELECT * FROM tabprov");
        res.json(results);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella province:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella province",
        });
    } finally {
        connection.end();
    }
});

app.get("/cronologia", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(connection, "SELECT user, algo, topic, cod_ric, sel_top, dat_cro FROM cronologia ORDER BY dat_cro ASC");
        const formattedResults = results.map((result) => ({
            user: result.user,
            algo: result.algo,
            topic: result.topic,
            cod_ric: result.cod_ric,
            top_sel: result.sel_top,
            id_dat: result.dat_cro.toISOString().split('T')[0],
        }));
        res.json(formattedResults);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella cronologia:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella cronologia",
        });
    } finally {
        connection.end();
    }
});

app.put("/cronologia/new", async (req, res) => {
    const utente = req.body.user;
    const algo = req.body.algo;
    const topic = req.body.topic;
    const codice = req.body.cod_ric;
    const top = req.body.top_sel;


    if (algo === null || algo === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'algoritmo",
        });
    }

    if (utente === null || utente === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'utente",
        });
    }

    if (topic === null || topic === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il topic",
        });
    }

    if (codice === null || codice === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il codice",
        });
    }

    if (top === null || top === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il top",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "INSERT INTO cronologia (user, algo, topic, cod_ric, sel_top) VALUES (?,?,?,?,?) ",
            [utente, algo, topic, codice, top]
        );
        res.status(200).json({
            message: "Inserito con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante L'inserimento:",
            error
        );
        res.status(500).json({
            error: "Errore durante L'inserimento",
        });
    } finally {
        connection.end();
    }
});

app.get("/feedback", async (req, res) => {
    const connection = await connectToDB();
    try {
        const results = await queryDatabase(connection, "SELECT dat_fed, user, cod_cli, cod_art, algo FROM ordclidet_feedback ORDER BY dat_fed ASC");
        const formattedResults = results.map((result) => ({
            id_dat: result.dat_fed.toISOString().split('T')[0],
            user: result.user,
            cod_cli: result.cod_cli,
            cod_art: result.cod_art,
            algo: result.algo,
        }));
        res.json(formattedResults);
    } catch (error) {
        console.error(
            "Errore durante il recupero dei dati dalla tabella cronologia:",
            error
        );
        res.status(500).json({
            error: "Errore durante il recupero dei dati dalla tabella cronologia",
        });
    } finally {
        connection.end();
    }
});

app.put("/feedback/newUser", async (req, res) => {
    const utente = req.body.user;
    const id_art = req.body.id;
    const id_ute = req.body.idRic;
    const algo = req.body.algoType;


    if (utente === null || utente === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'utente",
        });
    }

    if (id_art === null || id_art === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il codice",
        });
    }

    if (id_ute === null || id_ute === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il codice",
        });
    }

    if (algo === null || algo === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'algoritmo",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "INSERT INTO ordclidet_feedback (user, cod_cli, cod_art, algo) VALUES (?,?,?,?) ",
            [utente, id_ute, id_art, algo]
        );
        res.status(200).json({
            message: "Inserito con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante L'inserimento:",
            error
        );
        res.status(500).json({
            error: "Errore durante L'inserimento",
        });
    } finally {
        connection.end();
    }
});

app.put("/feedback/newItem", async (req, res) => {
    const utente = req.body.user;
    const id_ute = req.body.id;
    const id_art = req.body.idRic;
    const algo = req.body.algoType;

    if (utente === null || utente === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'utente",
        });
    }

    if (id_ute === null || id_ute === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il codice",
        });
    }

    if (id_art === null || id_art === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire il codice",
        });
    }

    if (algo === null || algo === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'algoritmo",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "INSERT INTO ordclidet_feedback (user, cod_cli, cod_art, algo) VALUES (?,?,?,?) ",
            [utente, id_ute, id_art, algo]
        );
        res.status(200).json({
            message: "Inserito con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante L'inserimento:",
            error
        );
        res.status(500).json({
            error: "Errore durante L'inserimento",
        });
    } finally {
        connection.end();
    }
});

app.put("/feedback/delFeed", async (req, res) => {
    const id_feed = req.body.id_feed;

    if (id_feed === null || id_feed === "") {
        return res.status(400).json({
            error: "Errore. Devi fornire l'id",
        });
    }

    const connection = await connectToDB();
    try {
        await queryDatabase(
            connection,
            "DELETE FROM ordclidet_feedback WHERE id = ? ",
            [id_feed]
        );
        res.status(200).json({
            message: "eliminato con successo",
        });
    } catch (error) {
        console.error(
            "Errore durante l'eliminazione:",
            error
        );
        res.status(500).json({
            error: "Errore durante l'eliminazione",
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
        connection.query(query, params, (error, results) => {
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
