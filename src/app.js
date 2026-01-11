import express from "express";
import usersRouter from "./routes/users.routes.js";
import playlistsRouter from "./routes/playlists.routes.js";
import songsRouter from "./routes/songs.routes.js";
import { setupSwagger } from "./swagger.js";
import playlistSongsRouter from "./routes/playlistSongs.route.js";
const app = express();

app.use(express.json());


app.use("/users", usersRouter);
app.use("/playlists", playlistsRouter);
app.use("/songs", songsRouter);
app.use("/playlist-songs", playlistSongsRouter);

setupSwagger(app);

export default app;
