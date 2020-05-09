let server;
const request = require("supertest");
const { Genres } = require("../../models/genres");
const { Users } = require("../../models/users")
const mongoose = require("mongoose");

describe("/api/genres", () => {
    beforeEach(() => { server = require("../../index"); });
    afterEach(async () => {
        await server.close();
        await Genres.remove({});
    });
    describe("GET /", () => {
        it("return a list of genres", async () => {

            await Genres.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ]);

            const result = await request(server).get("/vidly.com/api/genres");
            expect(result.status).toBe(200);
            //expect(result.body.length).toBe(2);
            expect(result.body.some(g => g.name === "genre1")).toBeTruthy();
            expect(result.body.some(g => g.name === "genre2")).toBeTruthy();
        })
    })

    describe("GET /:id", () => {
        it("should return genre with given id", async () => {
            const genre = new Genres({ name: "genre1" });
            await genre.save();

            const res = await request(server).get("/vidly.com/api/genres/" + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });

        it("should return 404 if valid id is not given", async () => {
            const res = await request(server).get("/vidly.com/api/genres/1");
            expect(res.status).toBe(404);
        });

        it("should return 404 if no genre with the given id exist", async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get("/vidly.com/api/genres/" + id);
            expect(res.status).toBe(404);
        });
    })

    describe("POST /", () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post("/vidly.com/api/genres")
                .set("x-auth-token", token)
                .send({ name })
        }

        beforeEach(() => {
            token = new Users().generateAuthToken();
            name = "genre1";
        })

        it("return 401 if the user is not logged in.", async () => {
            token = "";
            const result = await exec();
            expect(result.status).toBe(401);
        });

        it("return 400 if the use provide invalid body.", async () => {
            name = "1234";
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it("return 400 if the use provide more than 50 character in body.", async () => {
            name = new Array(52).join("a");
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it("should save the genre if it valid.", async () => {
            await exec();
            const genre = await Genres.find({ name: "genre1" });
            expect(genre).not.toBeNull();
        });

        it("should return a genre if it is valid.", async () => {
            const result = await exec();
            expect(result.body).toHaveProperty("_id");
            expect(result.body).toHaveProperty("name", "genre1");
        })
    });
    // test for put operation
    describe("PUT /:id", () => {
        let token;
        let newName;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put("/vidly.com/api/genres/" + id)
                .set("x-auth-token", token)
                .send({ name: newName });
        }

        beforeEach(async () => {
            genre = new Genres({ name: "genre1" });
            await genre.save();

            token = new Users().generateAuthToken();
            id = genre._id;
            newName = "updatedName";
        })

        it("should return 401 if client is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it("return 400 if caharacter is less than 5 character", async () => {
            newName = "1234";
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it("return 400 if genre is more than 50 character long..", async () => {
            newName = new Array(52).join("a");
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 404 if id is invalid", async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 404 if id is invalid", async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should update the genre if the input is valid", async () => {
            await exec();
            const updatedGenre = await Genres.findById(genre._id);
            expect(updatedGenre.name).toBe(newName);
        });

        it("should return updated genre if it is valid", async () => {
            const res = await exec();

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", newName);
        });
    });

    describe("DELETE/:id", () => {
        let token;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .delete("/vidly.com/api/genres/" + id)
                .set("x-auth-token", token)
                .send();
        }

        beforeEach(async () => {
            genre = new Genres({ name: "genre1" });
            await genre.save();
            id = genre._id;
            token = new Users({ isAdmin: true }).generateAuthToken();
        });

        it("should return 401 if user is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 403 if user is not a admin", async () => {
            token = new Users({ isAdmin: false }).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it("should return 404 if id is not valid", async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 404 if id is not found", async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should delete the genre if id is valid", async () => {
            await exec();
            const genre = await Genres.findById(id);
            expect(genre).toBeNull();
        });

        it("should return the remove genre", async () => {
            const res = await exec();

            expect(res.body).toHaveProperty("_id", genre._id.toHexString());
            expect(res.body).toHaveProperty("name", genre.name)
        })
    })

})