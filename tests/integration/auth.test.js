let server;
const request = require("supertest");
const { Users } = require("../../models/users");
const { Genres } = require("../../models/genres");
describe("auth middleware", () => {
    let token;

    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await Genres.remove({});
        await server.close()
    });

    const exec = () => {
        return request(server)
            .post("/vidly.com/api/genres")
            .set("x-auth-token", token)
            .send({ name: "genre4" })
    }

    beforeEach(() => {
        token = new Users().generateAuthToken();
    })

    it("return 401 if the token is not provided", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it("return 400 if invalid token provided", async () => {
        token = "a";
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it("return 200 if valid token is provided", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});