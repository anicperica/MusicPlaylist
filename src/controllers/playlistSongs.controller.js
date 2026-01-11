import prisma from "../prismaClient.js";

export const getPlaylistSongs = async (req, res) => {
  try {
    const playlistSongs = await prisma.playlistSong.findMany({
      include: { playlist: true, song: true },
    });
    res.json(playlistSongs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaylistSong = async (req, res) => {
  const playlistId = Number(req.params.playlistId);
  const songId = Number(req.params.songId);

  try {
    const playlistSong = await prisma.playlistSong.findUnique({
      where: { playlistId_songId: { playlistId, songId } },
      include: { playlist: true, song: true },
    });
    if (!playlistSong)
      return res.status(404).json({ error: "PlaylistSong not found" });
    res.json(playlistSong);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPlaylistSong = async (req, res) => {
  const { playlistId, songId } = req.body;
  try {
    const playlistSong = await prisma.playlistSong.create({
      data: { playlistId, songId },
      include: { playlist: true, song: true },
    });
    res.status(201).json(playlistSong);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePlaylistSong = async (req, res) => {
  const playlistId = Number(req.params.playlistId ?? req.body.playlistId);
  const songId = Number(req.params.songId ?? req.body.songId);

  if (!playlistId || !songId)
    return res
      .status(400)
      .json({ error: "playlistId and songId are required" });

  try {
    await prisma.playlistSong.delete({
      where: { playlistId_songId: { playlistId, songId } },
    });

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
