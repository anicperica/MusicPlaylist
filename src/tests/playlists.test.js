import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Playlists routes with admin/user GET middleware", () => {
  let createdSongId;
  let createdPlaylistId;
  const adminCredentials = Buffer.from("admin:admin123").toString("base64");
  const userCredentials = Buffer.from("user:user123").toString("base64"); 

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    // kreiramo usera
    await prisma.user.create({
      data: { username: "user", password: Buffer.from("user123").toString("base64") },
    });

    // kreiramo pjesmu
    const song = await prisma.song.create({
      data: { title: "Pariske Kapije", artist: "Haris Džinović", duration: 250 },
    });
    createdSongId = song.id;
  });

  after(async () => {
    await prisma.$disconnect();
  });

  // prvo kreiramo playlistu POST-om
  it("POST /playlists - admin kreira novu playlistu", async () => {
    const res = await request(app)
      .post("/playlists")
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({ name: "Test Playlist" });

    expect(res.status).to.equal(201);
    createdPlaylistId = res.body.id; // spremamo ID za GET/PUT/DELETE testove
  });

  it("POST /playlists - neautorizirani vraća 401", async () => {
    const res = await request(app).post("/playlists").send({ name: "X" });
    expect(res.status).to.equal(401);
  });

  // sada GET po ID-u i GET liste
  it("GET /playlists - admin može dohvatiti listu", async () => {
    const res = await request(app)
      .get("/playlists")
      .set("Authorization", `Basic ${adminCredentials}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("GET /playlists - user može dohvatiti listu", async () => {
    const res = await request(app)
      .get("/playlists")
      .set("Authorization", `Basic ${userCredentials}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("GET /playlists/:id - admin dohvaća playlistu po ID-u", async () => {
    const res = await request(app)
      .get(`/playlists/${createdPlaylistId}`)
      .set("Authorization", `Basic ${adminCredentials}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", createdPlaylistId);
  });

  it("GET /playlists/:id - user dohvaća playlistu po ID-u", async () => {
    const res = await request(app)
      .get(`/playlists/${createdPlaylistId}`)
      .set("Authorization", `Basic ${userCredentials}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", createdPlaylistId);
  });

  it("GET /playlists/:id - neautorizirani vraća 401", async () => {
    const res = await request(app).get(`/playlists/${createdPlaylistId}`);
    expect(res.status).to.equal(401);
  });

  // update playlist
  it("PUT /playlists/:id - admin ažurira playlistu", async () => {
    const res = await request(app)
      .put(`/playlists/${createdPlaylistId}`)
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({ name: "Playlista Remix" });
    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Playlista Remix");
  });

  it("PUT /playlists/:id - neautorizirani vraća 401", async () => {
    const res = await request(app)
      .put(`/playlists/${createdPlaylistId}`)
      .send({ name: "Neće proći" });
    expect(res.status).to.equal(401);
  });

  // sada POST playlist-songs da veza postoji prije GET testova
  it("POST /playlist-songs - admin dodaje pjesmu u playlistu", async () => {
    const res = await request(app)
      .post("/playlist-songs")
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({ playlistId: createdPlaylistId, songId: createdSongId });
    expect(res.status).to.equal(201);
  });

  it("GET /playlist-songs/:playlistId/:songId - admin može dohvatiti vezu", async () => {
    const res = await request(app)
      .get(`/playlist-songs/${createdPlaylistId}/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`);
    expect(res.status).to.equal(200);
  });

  it("GET /playlist-songs/:playlistId/:songId - user može dohvatiti vezu", async () => {
    const res = await request(app)
      .get(`/playlist-songs/${createdPlaylistId}/${createdSongId}`)
      .set("Authorization", `Basic ${userCredentials}`);
    expect(res.status).to.equal(200);
  });

  it("DELETE /playlist-songs/:playlistId/:songId - admin briše pjesmu iz playliste", async () => {
    const res = await request(app)
      .delete(`/playlist-songs/${createdPlaylistId}/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`);
    expect(res.status).to.equal(204);
  });

  it("DELETE /playlists/:id - admin briše playlistu", async () => {
    const res = await request(app)
      .delete(`/playlists/${createdPlaylistId}`)
      .set("Authorization", `Basic ${adminCredentials}`);
    expect(res.status).to.equal(200);
  });

  it("DELETE /playlists/:id - neautorizirani vraća 401", async () => {
    const res = await request(app)
      .delete(`/playlists/${createdPlaylistId}`);
    expect(res.status).to.equal(401);
  });
});
