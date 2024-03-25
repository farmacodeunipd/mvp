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

// Add more test cases for other endpoints as needed
