import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

const api = request(app);

describe("Users routes", () => {
  let createdUserId;

  before(async () => {

    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();
  });

  it("GET /users - vraća praznu listu", async () => {
    const res = await api.get("/users");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });

  it("POST /users - kreira usera", async () => {
    const res = await api.post("/users").send({
      name: "Test User",
      email: "test@test.com",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.name).to.equal("Test User");
    expect(res.body.email).to.equal("test@test.com");

    createdUserId = res.body.id;
  });

  it("GET /users - vraća 1 usera", async () => {
    const res = await api.get("/users");

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
  });

  it("GET /users/:id - vraća tog usera", async () => {
    const res = await api.get(`/users/${createdUserId}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(createdUserId);
    expect(res.body.name).to.equal("Test User");
  });

  it("PUT /users/:id - ažurira usera", async () => {
    await api.put(`/users/${createdUserId}`).send({
      name: "Updated Name",
      email: "updated@test.com",
    });

    const res = await api.get(`/users/${createdUserId}`);

    expect(res.body.name).to.equal("Updated Name");
    expect(res.body.email).to.equal("updated@test.com");
  });

  it("DELETE /users/:id - briše usera", async () => {
    const res = await api.delete(`/users/${createdUserId}`);
    expect(res.status).to.equal(200);

    const all = await api.get("/users");
    expect(all.body.length).to.equal(0);
  });
});
