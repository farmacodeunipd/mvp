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
        const response = await request(app).get("/prodotti/famigliecommerciali");
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
        const response = await request(app).get("/prodotti/sottofamigliecommerciali");
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

/* FIXXARE OUTPUT
describe("GET /userana/:use", () => {
    it("responds with JSON containing a single user anagrafica", async () => {
        const userID = "a";
        const response = await request(app).get(`/userana/${userID}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    nom_ute: expect.any(String),
                    cog_ute: expect.any(String),
                    dat_ute: expect.any(String),
                    use_ute: expect.any(String),
                    mai_use: expect.any(String),
                    pas_ute: expect.any(String),
                }),
            ])
        );
    });
});
*/

describe("PUT /userana/:use/email", () => {
    it("responds with JSON containing a success message when updating email", async () => {
        const userID = "a";
        const newEmail = "prova@prova.com";
        const response = await request(app).put(`/userana/${userID}/email`).send({ newEmail });
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
        const response = await request(app).put(`/userana/${userID}/email`).send({ newEmail });
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
        const response = await request(app).put(`/userana/${userID}/password`).send({ newPassword });
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
        const response = await request(app).put(`/userana/${userID}/password`).send({ newPassword });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(
            expect.objectContaining({
                error: expect.any(String),
            })
        );
    });
});