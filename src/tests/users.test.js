import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Users routes", () => {
  let createdUserId;
  const adminCredentials = Buffer.from("admin:admin123").toString("base64");

  before(async () => {
   
    await prisma.user.deleteMany();
  });

  after(async () => {
    await prisma.$disconnect();
  });

  it("POST /users/register - registrira novog korisnika", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ username: "testuser", password: "12345" });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.username).to.equal("testuser");

    createdUserId = res.body.id;
  });

  it("POST /users/register - vraća 400 za duplikat username-a", async () => {
    const res = await request(app)
      .post("/users/register")
      .send({ username: "testuser", password: "12345" });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Username already exists");
  });

  it("GET /users - vraća listu korisnika (admin)", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.some(u => u.username === "testuser")).to.be.true;
  });

  it("GET /users/:id - vraća korisnika po ID-u (admin)", async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", createdUserId);
    expect(res.body).to.have.property("username", "testuser");
  });

  it("PUT /users/:id - ažurira korisnika (admin)", async () => {
    const res = await request(app)
      .put(`/users/${createdUserId}`)
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({ username: "updateduser", password: "54321" });

    expect(res.status).to.equal(200);
    expect(res.body.username).to.equal("updateduser");
  });

  it("PUT /users/:id - vraća 401 bez autentifikacije", async () => {
    const res = await request(app)
      .put(`/users/${createdUserId}`)
      .send({ username: "failuser" });

    expect(res.status).to.equal(401);
  });

  it("DELETE /users/:id - briše korisnika (admin)", async () => {
    const res = await request(app)
      .delete(`/users/${createdUserId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("User deleted");
  });

  it("GET /users/:id - vraća 404 za obrisanog korisnika", async () => {
    const res = await request(app)
      .get(`/users/${createdUserId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(404);
  });

  it("DELETE /users/:id - vraća 401 bez autentifikacije", async () => {
    const res = await request(app).delete(`/users/${createdUserId}`);
    expect(res.status).to.equal(401);
  });
});
