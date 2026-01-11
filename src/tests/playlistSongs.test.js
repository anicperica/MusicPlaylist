import "dotenv/config";
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import prisma from "../prismaClient.js";

describe("PlaylistSongs routes", () => {
  let createdUserId;
  let createdPlaylistId;
  let createdSongId;

  before(async () => {
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { name: "Test User", email: "testuser@example.com" },
    });
    createdUserId = user.id;

    const playlist = await prisma.playlist.create({
      data: { name: "Test Playlist", userId: createdUserId },
    });
    createdPlaylistId = playlist.id;

    const song = await prisma.song.create({
      data: {
        title: "Pariske Kapije",
        artist: "Haris Džinović",
        duration: 250,
      },
    });
    createdSongId = song.id;
  });

  it("POST /playlist-songs - dodaje pjesmu u playlistu", async () => {
    const res = await request(app).post("/playlist-songs").send({
      playlistId: createdPlaylistId,
      songId: createdSongId,
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("playlistId", createdPlaylistId);
    expect(res.body.song.title).to.equal("Pariske Kapije");
  });

  it("GET /playlist-songs - vraća listu svih veza pjesama i playlisti", async () => {
    const res = await request(app).get("/playlist-songs");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(1);
    expect(res.body[0].song.title).to.equal("Pariske Kapije");
  });

  it("GET /playlist-songs/:playlistId/:songId - vraća vezu po ID-jevima", async () => {
    const res = await request(app).get(
      `/playlist-songs/${createdPlaylistId}/${createdSongId}`
    );

    expect(res.status).to.equal(200);
    expect(res.body.playlistId).to.equal(createdPlaylistId);
    expect(res.body.songId).to.equal(createdSongId);
    expect(res.body.song.title).to.equal("Pariske Kapije");
  });

  it("DELETE /playlist-songs/:playlistId/:songId - briše pjesmu iz playlist-e", async () => {
    const res = await request(app).delete(
      `/playlist-songs/${createdPlaylistId}/${createdSongId}`
    );

    expect(res.status).to.equal(204);

    const playlistSong = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: createdPlaylistId,
          songId: createdSongId,
        },
      },
    });
    expect(playlistSong).to.be.null;
  });
});
