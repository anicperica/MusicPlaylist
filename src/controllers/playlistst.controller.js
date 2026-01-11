import prisma from "../prismaClient.js";


export const getPlaylists = async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: { user: true, songs: { include: { song: true } } },
    });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  

export const getPlaylistById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { user: true, songs: { include: { song: true } } },
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createPlaylist = async (req, res) => {
  const { name, userId } = req.body;
  try {
    const playlist = await prisma.playlist.create({
      data: { name, userId },
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const updatePlaylist = async (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const playlist = await prisma.playlist.update({
      where: { id },
      data: { name },
    });
    res.json(playlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const deletePlaylist = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.playlist.delete({ where: { id } });
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
