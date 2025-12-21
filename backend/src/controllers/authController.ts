import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthJwtPayload } from "../types";
import { pool } from "../lib/db";
import { signToken } from "../lib/auth";

/**
 * SIGNUP
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, email
      `,
      [name ?? null, email, hashedPassword]
    );

    const user = result.rows[0];

    // Sign JWT
    const token = signToken({
      id: user.id,
      email: user.email,
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err: any) {
    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/**
 * GET CURRENT USER
 * (requires authMiddleware)
 */
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.json({
    id: req.user.id,
    email: req.user.email,
  });
};

/**
 * LOGOUT
 */
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({
    message: "Logged out successfully",
  });
};
