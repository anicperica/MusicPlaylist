import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("PlaylistSongs routes with admin/user GET middleware", () => {
  let createdPlaylistId;
  let createdSongId;
  const adminCredentials = Buffer.from("admin:admin123").toString("base64");
  const userCredentials = Buffer.from("user:user123").toString("base64"); 

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
      data: { username: "user", password: Buffer.from("user123").toString("base64") },
    });

    const playlist = await prisma.playlist.create({ data: { name: "Test Playlist" } });
    createdPlaylistId = playlist.id;

    const song = await prisma.song.create({
      data: { title: "Pariske Kapije", artist: "Haris Džinović", duration: 250 },
    });
    createdSongId = song.id;
  });

  after(async () => {
    await prisma.$disconnect();
  });


  it("POST /playlist-songs - admin dodaje pjesmu u playlistu", async () => {
    const res = await request(app)
      .post("/playlist-songs")
      .set("Authorization", `Basic ${adminCredentials}`)
      .send({ playlistId: createdPlaylistId, songId: createdSongId });

    expect(res.status).to.equal(201);
    expect(res.body.playlistId).to.equal(createdPlaylistId);
    expect(res.body.songId).to.equal(createdSongId);
  });

  it("POST /playlist-songs - neautorizirani vraća 401", async () => {
    const res = await request(app).post("/playlist-songs").send({
      playlistId: createdPlaylistId,
      songId: createdSongId,
    });
    expect(res.status).to.equal(401);
  });

  
  it("GET /playlist-songs - admin može dohvatiti listu", async () => {
    const res = await request(app)
      .get("/playlist-songs")
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("GET /playlist-songs - user može dohvatiti listu", async () => {
    const res = await request(app)
      .get("/playlist-songs")
      .set("Authorization", `Basic ${userCredentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("GET /playlist-songs - neautorizirani vraća 401", async () => {
    const res = await request(app).get("/playlist-songs");
    expect(res.status).to.equal(401);
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

  it("GET /playlist-songs/:playlistId/:songId - neautorizirani vraća 401", async () => {
    const res = await request(app).get(`/playlist-songs/${createdPlaylistId}/${createdSongId}`);
    expect(res.status).to.equal(401);
  });

  
  it("DELETE /playlist-songs/:playlistId/:songId - admin briše pjesmu iz playliste", async () => {
    const res = await request(app)
      .delete(`/playlist-songs/${createdPlaylistId}/${createdSongId}`)
      .set("Authorization", `Basic ${adminCredentials}`);

    expect(res.status).to.equal(204);
  });

  it("DELETE /playlist-songs/:playlistId/:songId - neautorizirani vraća 401", async () => {
    const res = await request(app).delete(
      `/playlist-songs/${createdPlaylistId}/${createdSongId}`
    );
    expect(res.status).to.equal(401);
  });
});
