import { JwtPayload } from "jsonwebtoken";

/**
 * JWT payload stored inside the token
 */
export interface AuthJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

/**
 * Extend Express Request to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export {};
