import express from "express";
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlistst.controller.js";
import basicAuth from "../middleware/basicAuthmiddleware.js";
import getAuth from "../middleware/getAuthmiddleware.js"
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Name of the playlist
 *         songs:
 *           type: array
 *           items:
 *             type: object
 *             description: Songs in the playlist
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Get all playlists (optionally filter by name)
 *     tags: [Playlists]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter playlists by name (contains)
 *     responses:
 *       200:
 *         description: List of playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 */
router.get("/", getAuth,getPlaylists);

/**
 * @swagger
 * /playlists/{id}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         description: Playlist not found
 */
router.get("/:id",getAuth, getPlaylistById);

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Playlist created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad Request
 */
router.post("/", basicAuth, createPlaylist);

/**
 * @swagger
 * /playlists/{id}:
 *   put:
 *     summary: Update a playlist
 *     tags: [Playlists]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Playlist updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad Request
 */
router.put("/:id", basicAuth, updatePlaylist);

/**
 * @swagger
 * /playlists/{id}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist deleted
 *       400:
 *         description: Bad Request
 */
router.delete("/:id", basicAuth, deletePlaylist);

export default router;
