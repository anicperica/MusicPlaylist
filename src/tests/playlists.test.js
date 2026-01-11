import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("Playlists routes", () => {
  let createdUserId;
  let createdSongId;
  let createdPlaylistId;

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { name: "Test User", email: "testuser@example.com" },
    });
    createdUserId = user.id;

    const song = await prisma.song.create({
      data: {
        title: "Pariske Kapije",
        artist: "Haris Džinović",
        duration: 250,
      },
    });
    createdSongId = song.id;
  });

  it("POST /playlists - kreira novu playlistu", async () => {
    const res = await request(app).post("/playlists").send({
      name: "Moja Playlist",
      userId: createdUserId,
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.name).to.equal("Moja Playlist");
    expect(res.body.userId).to.equal(createdUserId);

    createdPlaylistId = res.body.id;
  });

  it("GET /playlists - vraća listu playlisti", async () => {
    const res = await request(app).get("/playlists");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0].name).to.equal("Moja Playlist");
  });

  it("GET /playlists/:id - vraća playlistu po ID-u", async () => {
    const res = await request(app).get(`/playlists/${createdPlaylistId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", createdPlaylistId);
    expect(res.body.songs).to.be.an("array").that.is.empty;
  });

  it("PUT /playlists/:id - ažurira playlistu", async () => {
    const res = await request(app).put(`/playlists/${createdPlaylistId}`).send({
      name: "Playlista Remix",
    });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal("Playlista Remix");
  });

  it("POST /playlist-songs - dodaje pjesmu u playlistu", async () => {
    const res = await request(app).post("/playlist-songs").send({
      playlistId: createdPlaylistId,
      songId: createdSongId,
    });

    expect(res.status).to.equal(201);

    const playlist = await prisma.playlist.findUnique({
      where: { id: createdPlaylistId },
      include: { songs: { include: { song: true } } },
    });
    expect(playlist.songs.length).to.equal(1);
    expect(playlist.songs[0].song.title).to.equal("Pariske Kapije");
  });

  it("DELETE /playlist-songs - uklanja pjesmu iz playlist", async () => {
    const res = await request(app).delete(
      `/playlist-songs/${createdPlaylistId}/${createdSongId}`
    );

    expect(res.status).to.equal(204);

    const playlist = await prisma.playlist.findUnique({
      where: { id: createdPlaylistId },
      include: { songs: { include: { song: true } } },
    });
    expect(playlist.songs).to.be.an("array").that.is.empty;
  });

  it("DELETE /playlists/:id - briše playlistu", async () => {
    const res = await request(app).delete(`/playlists/${createdPlaylistId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Playlist deleted");
  });
});
