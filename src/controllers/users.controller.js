import prisma from "../prismaClient.js";


export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const base64Password = Buffer.from(password).toString("base64");

    const user = await prisma.user.create({
      data: {
        username,
        password: base64Password,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      id: user.id,
      username: user.username,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const { username, password } = req.body;

  try {
    const data = {};

    if (username) data.username = username;
    if (password) {
      data.password = Buffer.from(password).toString("base64");
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
