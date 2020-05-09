const { Rental } = require("../../models/rental");
const { Users } = require("../../models/users");
const { Movies } = require("../../models/movies");
const moment = require("moment");
const request = require("supertest");
const mongoose = require("mongoose");

describe("/vidly.com/api/returns", () => {

    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    const exec = () => {
        return request(server)
            .post("/vidly.com/api/returns")
            .set("x-auth-token", token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require("../../index");
        token = new Users().generateAuthToken();

        movie = new Movies({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: { name: "12345" },
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345"
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movies.remove({});
    });

    it("should return 401 if user is not logged in", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it("should return 400 if customer id is not provided", async () => {
        customerId = "";
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it("should return 400 if movie id is not provided", async () => {
        movieId = "";
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it("should return 404 if customer does not found with this combination", async () => {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it("should return 400 is return is already processed", async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it("should return 200 if valid request is send", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it("should set the return date", async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it("should calculate the rental fee", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the movies stock", async () => {
        const res = await exec();
        const movieInDb = await Movies.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental if input is valid", async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(res.body).toHaveProperty("dataOut");
        expect(res.body).toHaveProperty("dateReturned");
        expect(res.body).toHaveProperty("rentalFee");
        expect(res.body).toHaveProperty("customer");
        expect(res.body).toHaveProperty("movie");
    });
})