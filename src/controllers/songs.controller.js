import prisma from "../prismaClient.js";

export const getSongs = async (req, res) => {
  try {
    const { title, artist, sortBy, order } = req.query;

    const where = {};
    if (title) {
      where.title = { contains: title, mode: "insensitive" };
    }
    if (artist) {
      where.artist = { contains: artist, mode: "insensitive" };
    }

    let orderBy;
    if (sortBy === "duration") {
      orderBy = { duration: order === "desc" ? "desc" : "asc" };
    } else if (sortBy === "title") {
      orderBy = { title: order === "desc" ? "desc" : "asc" };
    } else if (sortBy === "artist") {
      orderBy = { artist: order === "desc" ? "desc" : "asc" };
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy,
    });

    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSongById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSong = async (req, res) => {
  const { title, artist, duration } = req.body;
  try {
    const song = await prisma.song.create({
      data: { title, artist, duration },
    });
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSong = async (req, res) => {
  const id = Number(req.params.id);
  const { title, artist, duration } = req.body;
  try {
    const song = await prisma.song.update({
      where: { id },
      data: { title, artist, duration },
    });
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteSong = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.song.delete({ where: { id } });
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
