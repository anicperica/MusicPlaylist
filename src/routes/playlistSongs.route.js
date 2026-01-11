import express from "express";
import {
  getPlaylistSongs,
  getPlaylistSong,
  createPlaylistSong,
  deletePlaylistSong,
} from "../controllers/playlistSongs.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PlaylistSong:
 *       type: object
 *       required:
 *         - playlistId
 *         - songId
 *       properties:
 *         playlistId:
 *           type: integer
 *           description: ID of the playlist
 *         songId:
 *           type: integer
 *           description: ID of the song
 *         playlist:
 *           $ref: '#/components/schemas/Playlist'
 *         song:
 *           $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /playlist-songs:
 *   get:
 *     summary: Get all playlist-song relationships
 *     tags: [PlaylistSongs]
 *     responses:
 *       200:
 *         description: List of all playlist-song relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlaylistSong'
 */
router.get("/", getPlaylistSongs);

/**
 * @swagger
 * /playlist-songs/{playlistId}/{songId}:
 *   get:
 *     summary: Get a playlist-song relationship by playlistId and songId
 *     tags: [PlaylistSongs]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Playlist-song relationship details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistSong'
 *       404:
 *         description: Playlist-song relationship not found
 */
router.get("/:playlistId/:songId", getPlaylistSong);

/**
 * @swagger
 * /playlist-songs:
 *   post:
 *     summary: Create a new playlist-song relationship
 *     tags: [PlaylistSongs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playlistId
 *               - songId
 *             properties:
 *               playlistId:
 *                 type: integer
 *               songId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Playlist-song relationship created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistSong'
 */
router.post("/", createPlaylistSong);

/**
 * @swagger
 * /playlist-songs/{playlistId}/{songId}:
 *   delete:
 *     summary: Delete a playlist-song relationship
 *     tags: [PlaylistSongs]
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Playlist-song relationship deleted successfully
 */
router.delete("/:playlistId/:songId", deletePlaylistSong);

export default router;
