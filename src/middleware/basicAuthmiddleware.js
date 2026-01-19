import dotenv from "dotenv";
dotenv.config();

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authorization header sa je obavezan",
    });
  }

  try {
    
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");


    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.user = { username };
      next();
    } else {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Neispravni username ili password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Neispravan format Authorization headera",
    });
  }
};

export default basicAuth;
