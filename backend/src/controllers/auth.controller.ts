import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model.js";

const generateToken = (user: {
  id: string;
  email: string;
  role: string;
}): string => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || "DEFAULT_SECRET";
  return jwt.sign(payload, secret, { expiresIn: "8h" });
};

export const register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    // Usamos .get({ plain: true }) que es la forma segura de obtener el objeto
    const userResponse = newUser.get({ plain: true });
    delete userResponse.password;

    const token = generateToken(userResponse);
    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Ya no necesitamos forzar la inclusión porque el modelo simplificado no oculta el password.
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const userPassword = (user as any).password;
    if (!userPassword) {
      return res
        .status(401)
        .json({ message: "Credenciales incorrectas (no hay password en DB)." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userPassword);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Credenciales incorrectas (comparación fallida)." });
    }

    const userResponse = user.get({ plain: true });
    delete userResponse.password;
    const token = generateToken(userResponse);
    res.status(200).json({
      message: "Inicio de sesión exitoso.",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
