import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Songs routes with admin/user GET middleware", () => {
  let createdSongId;
  const adminCredentials = Buffer.from("admin:admin123").toString("base64");
  const userCredentials = Buffer.from("user:user123").toString("base64"); 

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.song.deleteMany();
await prisma.playlist.deleteMany();
  await prisma.user.deleteMany();
    await prisma.user.create({
      data: { username: "user", password: Buffer.from("user123").toString("base64") },
    });
  });

  after(async () => {
    await prisma.$disconnect();
  });

 
  it("GET /songs - admin može dohvatiti praznu listu", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("GET /songs - user može dohvatiti praznu listu", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Basic ${userCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("GET /songs - neautorizirani vraća 401", async () => {
    const res = await request(app).get("/songs");
    expect(res.status).to.equal(401);
  });


  it("POST /songs - admin kreira novu pjesmu", async () => {
    const res = await request(app)
      .post("/songs")
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({
        title: "Pariske Kapije",
        artist: "Haris Džinović",
        duration: 250,
      });

    expect(res.status).to.equal(201);
    createdSongId = res.body.id;
  });

  it("GET /songs - lista s jednom pjesmom (admin)", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].title).to.equal("Pariske Kapije");
  });

  it("GET /songs - lista s jednom pjesmom (user)", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Basic ${userCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
    expect(res.body[0].title).to.equal("Pariske Kapije");
  });

  it("GET /songs/:id - vraća pjesmu po ID-u (admin)", async () => {
    const res = await request(app)
      .get(`/songs/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Pariske Kapije");
  });

  it("GET /songs/:id - vraća pjesmu po ID-u (user)", async () => {
    const res = await request(app)
      .get(`/songs/${createdSongId}`)
      .set("Authorization", `Basic ${userCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Pariske Kapije");
  });

  it("GET /songs/:id - vraća 401 ako nije auth", async () => {
    const res = await request(app).get(`/songs/${createdSongId}`);
    expect(res.status).to.equal(401);
  });

  
  it("PUT /songs/:id - admin ažurira pjesmu", async () => {
    const res = await request(app)
      .put(`/songs/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({
        title: "Pariske Kapije (Remix)",
        artist: "Haris Džinović",
        duration: 255,
      });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal("Pariske Kapije (Remix)");
  });

  it("DELETE /songs/:id - admin briše pjesmu", async () => {
    const res = await request(app)
      .delete(`/songs/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Song deleted");
  });
});
