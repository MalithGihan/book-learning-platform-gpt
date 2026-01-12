import jwt from "jsonwebtoken";

type Role = "student" | "instructor" | "admin";

export type JwtPayload = {
  sub: string;       // user id
  role: Role;
  email: string;
};

const ACCESS_MIN = Number(process.env.ACCESS_MINUTES || 15);
const REFRESH_DAYS = Number(process.env.REFRESH_DAYS || 7);

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: `${ACCESS_MIN}m`,
  });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: `${REFRESH_DAYS}d`,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
}
