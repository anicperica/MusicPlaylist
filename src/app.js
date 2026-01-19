import express from "express";
import playlistsRouter from "./routes/playlists.routes.js";
import songsRouter from "./routes/songs.routes.js";
import { setupSwagger } from "./swagger.js";
import playlistSongsRouter from "./routes/playlistSongs.route.js";
import userRouter from "./routes/users.routes.js"
const app = express();

app.use(express.json());


app.use("/playlists", playlistsRouter);
app.use("/songs", songsRouter);
app.use("/playlist-songs", playlistSongsRouter);
app.use("/users", userRouter);
setupSwagger(app);

export default app;
