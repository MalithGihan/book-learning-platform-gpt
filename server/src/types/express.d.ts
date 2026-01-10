declare namespace Express {
  export interface Request {
    user?: { id: string; email: string; role: "student" | "instructor" | "admin"; name: string };
  }
}
