import jwt, { SignOptions } from "jsonwebtoken";
import { APP_CONFIG, ROLES } from "../config/constants";

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

const SECRET = String(APP_CONFIG.JWT_SECRET);
const EXPIRY = String(APP_CONFIG.JWT_EXPIRY);

export const generateToken = (payload: ITokenPayload): string => {
  const options: SignOptions = {
    expiresIn: EXPIRY as any,
  };
  return jwt.sign(payload, SECRET as any, options);
};

export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET as any) as ITokenPayload;
    return decoded;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
};

export const decodeToken = (token: string): ITokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as ITokenPayload | null;
    return decoded;
  } catch (error) {
    return null;
  }
};
