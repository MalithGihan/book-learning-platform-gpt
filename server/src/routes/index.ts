import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import coursesRoutes from "../modules/courses/courses.routes";
import enrollmentsRoutes from "../modules/enrollments/enrollments.routes";
import instructorRouter from "../modules/instructor/instructor.routes";
import aiRoutes from "./ai.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/courses", coursesRoutes);
routes.use("/enrollments", enrollmentsRoutes);
routes.use("/instructor", instructorRouter);
routes.use("/ai", aiRoutes);

export default routes;
