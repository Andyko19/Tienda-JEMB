import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Se importa tanto el Modelo (User) como la Interfaz de tipos (UserAttributes)
import User from "../database/models/user.model.js";
import type { UserAttributes } from "../database/models/user.model.js";

/**
 * Genera un token JWT para un usuario.
 * Se usa la interfaz 'UserAttributes' para asegurar que el objeto 'user' tenga las propiedades necesarias.
 */
const generateToken = (user: UserAttributes): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Se usa una variable de entorno para el secreto del token. Es más seguro.
  const secret = process.env.JWT_SECRET || "DEFAULT_SECRET";

  const token = jwt.sign(payload, secret, {
    expiresIn: "8h", // El token expirará en 8 horas
  });

  return token;
};

/**
 * Registra un nuevo usuario en la base de datos.
 */
export const register = async (req: Request, res: Response) => {
  const { name, lastName, email, password } = req.body;

  try {
    // 1. Verificar si el correo ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso." });
    }

    // 2. Hashear (encriptar) la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear el nuevo usuario en la base de datos
    console.log(
      `[REGISTER] Contraseña hasheada para ${email}:`,
      hashedPassword
    );
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    // Se usa .get({ plain: true }) para obtener un objeto simple y se omite la contraseña
    const { password: _, ...userResponse } = newUser.get({ plain: true });

    // 4. Generar un token para el nuevo usuario
    const token = generateToken(userResponse);

    // 5. Enviar la respuesta
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

/**
 * Inicia sesión para un usuario existente.
 */
export const login = async (req: Request, res: Response) => {
  console.log("\n--- [LOGIN] Intento de inicio de sesión recibido ---"); // Separador
  const { email, password } = req.body;

  try {
    console.log(`[LOGIN] Buscando usuario con email: ${email}`);
    // 1. Verificar si el usuario existe (se usa la clase 'User' como tipo)
    const user: User | null = await User.findOne({ where: { email } });
    if (!user) {
      console.log(
        `[LOGIN] Resultado: Usuario con email ${email} NO ENCONTRADO.`
      );
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 2. Añadimos una verificación de seguridad:
    // Si el usuario no tiene contraseña (ej. se registró con Google), no puede iniciar sesión localmente.
    console.log(
      "[LOGIN] Usuario encontrado en la BD:",
      user.get({ plain: true })
    );
    if (!user.password) {
      console.log(
        "[LOGIN] Resultado: El usuario no tiene contraseña (posiblemente login social)."
      );
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // 3. Verificar si la contraseña es correcta
    console.log(`[LOGIN] Comparando contraseña enviada: "${password}"`);
    console.log(`[LOGIN] Con hash de la BD: "${user.password}"`);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(
      "[LOGIN] Resultado de la comparación de contraseñas:",
      isPasswordCorrect
    );
    if (!isPasswordCorrect) {
      console.log("--- [LOGIN] FIN: Contraseña incorrecta ---");
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // Se obtiene un objeto simple del usuario y se omite la contraseña para la respuesta
    const { password: __, ...userResponse } = user.get({ plain: true });

    // 4. Generar un nuevo token
    const token = generateToken(userResponse);
    console.log("--- [LOGIN] FIN: Éxito ---");

    // 5. Enviar la respuesta
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
