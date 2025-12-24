import jwt from "jsonwebtoken";
import { AuthJwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export const signToken = (payload: AuthJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): AuthJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthJwtPayload;
};
