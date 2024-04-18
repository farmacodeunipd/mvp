const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
    it('responds with "Server is running!"', async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Server is running!");
    });
});

describe("GET /login/:use", () => {
    it("responds with JSON containing the user login info", async () => {
        const use = "a";
        const response = await request(app).get(`/login/${use}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    use_ute: expect.any(String),
                    pas_ute: expect.any(String),
                    amm_ute: expect.any(Number),
                }),
            ])
        );
    });

    it("responds with JSON containing the 404 status", async () => {
        const use = "c";
        const response = await request(app).get(`/login/${use}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});

describe("GET /users", () => {
    it("responds with JSON containing a list of users", async () => {
        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_cli: expect.any(Number),
                    rag_soc: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /users/:id", () => {
    it("responds with JSON containing a single user", async () => {
        const id = 120;
        const response = await request(app).get(`/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_cli: expect.any(Number),
                    rag_soc: expect.any(String),
                }),
            ])
        );
    });
    it("responds with JSON containing the 404 status", async () => {
        const id = 1;
        const response = await request(app).get(`/users/${id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});

describe("GET /items", () => {
    it("responds with JSON containing a list of items", async () => {
        const response = await request(app).get("/items");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_art: expect.any(String),
                    des_art: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /items/:id", () => {
    it("responds with JSON containing a single item", async () => {
        const id = 1102103;
        const response = await request(app).get(`/items/${id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_art: expect.any(String),
                    des_art: expect.any(String),
                }),
            ])
        );
    });
    it("responds with JSON containing the 404 status", async () => {
        const id = 1102100;
        const response = await request(app).get(`/items/${id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});

describe("GET /prodotti", () => {
    it("responds with JSON containing a list of prodotti", async () => {
        const response = await request(app).get("/prodotti");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_art: expect.any(String),
                    des_art: expect.any(String),
                    lineecomm: {
                        cod_linea_comm: expect.any(String),
                        linea_comm: expect.any(String),
                    },
                    settoricomm: {
                        cod_sett_comm: expect.any(String),
                        sett_comm: expect.any(String),
                    },
                    famigliecomm: {
                        cod_fam_comm: expect.any(String),
                        fam_comm: expect.any(String),
                    },
                    sottofamigliecomm: {
                        cod_sott_comm: expect.any(String),
                        sott_comm: expect.any(String),
                    },
                }),
            ])
        );
    });
});

describe("GET /prodotti/lineecommerciali", () => {
    it("responds with JSON containing a list of linee commerciali", async () => {
        const response = await request(app).get("/prodotti/lineecommerciali");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_linea_comm: expect.any(String),
                    linea_comm: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /prodotti/settoricommerciali", () => {
    it("responds with JSON containing a list of settori commerciali", async () => {
        const response = await request(app).get("/prodotti/settoricommerciali");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_sett_comm: expect.any(String),
                    sett_comm: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /prodotti/famigliecommerciali", () => {
    it("responds with JSON containing a list of famiglie commerciali", async () => {
        const response = await request(app).get(
            "/prodotti/famigliecommerciali"
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_fam_comm: expect.any(String),
                    fam_comm: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /prodotti/sottofamigliecommerciali", () => {
    it("responds with JSON containing a list of sotto_famiglie commerciali", async () => {
        const response = await request(app).get(
            "/prodotti/sottofamigliecommerciali"
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_sott_comm: expect.any(String),
                    sott_comm: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /clienti", () => {
    it("responds with JSON containing a list of clienti", async () => {
        const response = await request(app).get("/clienti");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_cli: expect.any(Number),
                    prov: {
                        cod_prov: expect.any(String),
                        des_prov: expect.any(String),
                    },
                    rag_soc: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /clienti/province", () => {
    it("responds with JSON containing a list of province", async () => {
        const response = await request(app).get("/clienti/province");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    cod_prov: expect.any(String),
                    des_prov: expect.any(String),
                }),
            ])
        );
    });
});

describe("GET /cronologia", () => {
    it("responds with JSON containing a list of cronologia", async () => {
        const response = await request(app).get("/cronologia");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user: expect.any(String),
                    algo: expect.any(String),
                    topic: expect.any(String),
                    cod_ric: expect.any(String),
                    top_sel: expect.any(String),
                    id_dat: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                }),
            ])
        );
    });
});

describe("PUT /cronologia/new", () => {
    it("responds with JSON containing a successful message when adding cronologia", async () => {
        const user = "a";
        const algo = "NN";
        const topic = "user";
        const cod_ric = "1";
        const top_sel = "5";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Inserito con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status for no user", async () => {
        const user = "";
        const algo = "NN";
        const topic = "user";
        const cod_ric = "1";
        const top_sel = "5";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'utente",
            })
        );
    });
    it("responds with JSON containing the 400 status for no algo", async () => {
        const user = "a";
        const algo = "";
        const topic = "user";
        const cod_ric = "1";
        const top_sel = "5";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'algoritmo",
            })
        );
    });
    it("responds with JSON containing the 400 status for no topic", async () => {
        const user = "a";
        const algo = "NN";
        const topic = "";
        const cod_ric = "1";
        const top_sel = "5";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il topic",
            })
        );
    });
    it("responds with JSON containing the 400 status for no cod_ric", async () => {
        const user = "a";
        const algo = "NN";
        const topic = "user";
        const cod_ric = "";
        const top_sel = "5";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il codice",
            })
        );
    });
    it("responds with JSON containing the 400 status for no top_sel", async () => {
        const user = "a";
        const algo = "NN";
        const topic = "user";
        const cod_ric = "1";
        const top_sel = "";
        const response = await request(app)
            .put("/cronologia/new")
            .send({ user, algo, topic, cod_ric, top_sel });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il top",
            })
        );
    });
});

describe("GET /feedback", () => {
    it("responds with JSON containing a list of feedback", async () => {
        const response = await request(app).get("/feedback");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id_feed: expect.any(Number),
                    id_dat: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                    user: expect.any(String),
                    cod_cli: expect.any(Number),
                    cod_art: expect.any(String),
                    algo: expect.any(String),
                }),
            ])
        );
    });
});

describe("PUT /feedback/newUser", () => {
    it("responds with JSON containing a successful message when adding feedback newUser", async () => {
        const user = "a";
        const id = "1101100";
        const idRic = "0";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newUser")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Inserito con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status for no user", async () => {
        const user = "";
        const id = "1101100";
        const idRic = "0";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newUser")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'utente",
            })
        );
    });
    it("responds with JSON containing the 400 status for no id", async () => {
        const user = "a";
        const id = "";
        const idRic = "0";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newUser")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il codice",
            })
        );
    });
    it("responds with JSON containing the 400 status for no idRic", async () => {
        const user = "a";
        const id = "1101100";
        const idRic = "";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newUser")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il codice",
            })
        );
    });
    it("responds with JSON containing the 400 status for no algoType", async () => {
        const user = "a";
        const id = "1101100";
        const idRic = "0";
        const algoType = "";
        const response = await request(app)
            .put("/feedback/newUser")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'algoritmo",
            })
        );
    });
});

describe("PUT /feedback/newItem", () => {
    it("responds with JSON containing a successful message when adding feedback newItem", async () => {
        const user = "a";
        const id = "0";
        const idRic = "1101100";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newItem")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Inserito con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status for no user", async () => {
        const user = "";
        const id = "0";
        const idRic = "1101100";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newItem")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'utente",
            })
        );
    });
    it("responds with JSON containing the 400 status for no id", async () => {
        const user = "a";
        const id = "";
        const idRic = "1101100";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newItem")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il codice",
            })
        );
    });
    it("responds with JSON containing the 400 status for no idRic", async () => {
        const user = "a";
        const id = "0";
        const idRic = "";
        const algoType = "NN";
        const response = await request(app)
            .put("/feedback/newItem")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire il codice",
            })
        );
    });
    it("responds with JSON containing the 400 status for no algoType", async () => {
        const user = "a";
        const id = "0";
        const idRic = "1101100";
        const algoType = "";
        const response = await request(app)
            .put("/feedback/newItem")
            .send({ user, id, idRic, algoType });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'algoritmo",
            })
        );
    });
});

describe("PUT /feedback/delFeed", () => {
    it("responds with JSON containing a successful message when deleting feedback", async () => {
        const id_feed = 1;
        const response = await request(app)
            .put("/feedback/delFeed")
            .send({ id_feed });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "eliminato con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status for no id_feed", async () => {
        const id_feed = "";
        const response = await request(app)
            .put("/feedback/delFeed")
            .send({ id_feed });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: "Errore. Devi fornire l'id",
            })
        );
    });
});

describe("GET /userana/:use", () => {
    it("responds with JSON containing a single user anagrafica", async () => {
        const userID = "a";
        const response = await request(app).get(`/userana/${userID}`);
        expect(response.status).toBe(200);
        expect(response.body[0]).toMatchObject({
            nom_ute: expect.any(String),
            cog_ute: expect.any(String),
            dat_ute: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), // Match YYYY-MM-DD format
            use_ute: expect.any(String),
            mai_ute: expect.any(String),
            pas_ute: expect.any(String),
        });
    });
});

describe("PUT /userana/:use/email", () => {
    it("responds with JSON containing a success message when updating email", async () => {
        const userID = "a";
        const newEmail = "prova@prova.com";
        const response = await request(app)
            .put(`/userana/${userID}/email`)
            .send({ newEmail });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Indirizzo email aggiornato con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status", async () => {
        const userID = "a";
        const newEmail = "";
        const response = await request(app)
            .put(`/userana/${userID}/email`)
            .send({ newEmail });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});

describe("PUT /userana/:use/password", () => {
    it("responds with JSON containing a success message when updating email", async () => {
        const userID = "a";
        const newPassword = "prova";
        const response = await request(app)
            .put(`/userana/${userID}/password`)
            .send({ newPassword });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: "Password aggiornata con successo",
            })
        );
    });
    it("responds with JSON containing the 400 status", async () => {
        const userID = "a";
        const newPassword = "";
        const response = await request(app)
            .put(`/userana/${userID}/password`)
            .send({ newPassword });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});
