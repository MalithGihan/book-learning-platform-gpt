import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import coursesRoutes from "../modules/courses/courses.routes";
import enrollmentsRoutes from "../modules/enrollments/enrollments.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/courses", coursesRoutes);
routes.use("/enrollments", enrollmentsRoutes);

export default routes;
