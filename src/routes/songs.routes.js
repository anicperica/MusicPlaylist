import express from "express";
import {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/songs.controller.js";
import basicAuth from "../middleware/basicAuthmiddleware.js";
import getAuth from "../middleware/getAuthmiddleware.js"

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - artist
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Song title
 *         artist:
 *           type: string
 *           description: Song artist
 *         duration:
 *           type: integer
 *           description: Duration of song in seconds
 *     SongInput:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *         artist:
 *           type: string
 *         duration:
 *           type: integer
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter songs by title (partial match, case-insensitive)
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Filter songs by artist (partial match, case-insensitive)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [duration]
 *         description: Sort by duration
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order (asc or desc)
 *     responses:
 *       '200':
 *         description: List of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */
router.get("/",getAuth, getSongs);

/**
 * @swagger
 * /songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     tags: [Songs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Song ID
 *     responses:
 *       '200':
 *         description: Song details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       '404':
 *         description: Song not found
 */
router.get("/:id",getAuth, getSongById);

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Create a new song
 *     tags: [Songs]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SongInput'
 *     responses:
 *       '201':
 *         description: Song created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       '400':
 *         description: Bad Request
 */
router.post("/", basicAuth, createSong);

/**
 * @swagger
 * /songs/{id}:
 *   put:
 *     summary: Update a song
 *     tags: [Songs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SongInput'
 *     responses:
 *       '200':
 *         description: Song updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       '400':
 *         description: Bad Request
 */
router.put("/:id", basicAuth, updateSong);

/**
 * @swagger
 * /songs/{id}:
 *   delete:
 *     summary: Delete a song
 *     tags: [Songs]
 *     security:
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Song ID
 *     responses:
 *       '200':
 *         description: Song deleted
 */
router.delete("/:id", basicAuth, deleteSong);

export default router;
