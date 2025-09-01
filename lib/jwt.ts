// lib/jwt.ts
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface JwtPayload {
  userId: string
  email: string
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload
  } catch (err) {
    return null
  }
}
