import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Songs routes", () => {
  let createdSongId;

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.song.deleteMany();
  });

  it("GET /songs - vraća praznu listu", async () => {
    const res = await request(app).get("/songs");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });

  it("POST /songs - kreira novu pjesmu (Pariske Kapije)", async () => {
    const res = await request(app).post("/songs").send({
      title: "Pariske Kapije",
      artist: "Haris Džinović",
      duration: 250, 
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.title).to.equal("Pariske Kapije");
    expect(res.body.artist).to.equal("Haris Džinović");

    createdSongId = res.body.id;
  });

  it("GET /songs - vraća listu s jednom pjesmom", async () => {
    const res = await request(app).get("/songs");

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].title).to.equal("Pariske Kapije");
    expect(res.body[0].artist).to.equal("Haris Džinović");
  });

  it("GET /songs/:id - vraća pjesmu po ID-u", async () => {
    const res = await request(app).get(`/songs/${createdSongId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", createdSongId);
    expect(res.body.title).to.equal("Pariske Kapije");
  });

  it("PUT /songs/:id - ažurira pjesmu", async () => {
    const res = await request(app).put(`/songs/${createdSongId}`).send({
      title: "Pariske Kapije (Remix)",
      artist: "Haris Džinović",
      duration: 255,
    });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Pariske Kapije (Remix)");
  });

  it("DELETE /songs/:id - briše pjesmu", async () => {
    const res = await request(app).delete(`/songs/${createdSongId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Song deleted");
  });

  it("GET /songs/:id - vraća 404 za obrisanu pjesmu", async () => {
    const res = await request(app).get(`/songs/${createdSongId}`);
    expect(res.status).to.equal(404);
  });
});
