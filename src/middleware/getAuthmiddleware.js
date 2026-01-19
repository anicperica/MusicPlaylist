import prisma from "../prismaClient.js";
import dotenv from "dotenv";
dotenv.config();

const authGet = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Mora postojati Basic header (nema public/guest)
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authorization header je obavezan",
    });
  }

  try {
    // Decode "Basic base64(username:password)"
    const base64Credentials = authHeader.slice(6);
    const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");

    if (!username || !password) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Neispravan format Authorization headera",
      });
    }

    // 1) Admin provjera (kao u basicAuth)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.user = { role: "admin", username };
      return next();
    }

    // 2) User provjera iz baze
    const user = await prisma.user.findUnique({ where: { username } });

    // (Ovo ti zadržavam istu logiku koju imaš: password u bazi je base64)
    const encodedPassword = Buffer.from(password).toString("base64");

    if (user && user.password === encodedPassword) {
      req.user = { role: "user", id: user.id, username: user.username };
      return next();
    }

    // Ako nije ni admin ni user
    return res.status(401).json({
      error: "Unauthorized",
      message: "Neispravni username ili password",
    });
  } catch (err) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Neispravan format Authorization headera",
    });
  }
};

export default authGet;
