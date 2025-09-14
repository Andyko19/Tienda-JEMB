import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserAttributes } from "../database/models/user.model.js";

// Extendemos la interfaz Request de Express para poder añadir nuestra propiedad 'user'
// Esto le da a TypeScript el contexto de lo que estamos haciendo.
interface AuthRequest extends Request {
  user?: UserAttributes;
}

/**
 * Middleware para validar el token JWT que viene en la cabecera de la petición.
 */
export const validateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // El token usualmente viene en el formato "Bearer <token>"
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denigado. No se proporcionó token." });
  }

  try {
    const secret = process.env.JWT_SECRET || "DEFAULT_SECRET";
    const decoded = jwt.verify(token, secret);

    // Adjuntamos el payload decodificado del token al objeto 'req'
    // para que las siguientes funciones (middlewares o controladores) puedan usarlo.
    req.user = decoded as UserAttributes;

    next(); // El token es válido, la petición puede continuar.
  } catch (error) {
    res.status(400).json({ message: "Token inválido." });
  }
};

/**
 * Middleware para verificar si el usuario tiene el rol de 'admin'.
 * IMPORTANTE: Este middleware DEBE ejecutarse DESPUÉS de validateToken.
 */
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
  next(); // El usuario es administrador, la petición puede continuar.
};
