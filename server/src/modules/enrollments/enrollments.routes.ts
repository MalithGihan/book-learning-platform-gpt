import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireRole } from "../../middlewares/requireRole";
import { enrollInCourse, myEnrollments } from "./enrollments.controller";

const router = Router();

router.post("/:courseId", requireAuth, requireRole("student", "admin"), enrollInCourse);
router.get("/me", requireAuth, requireRole("student", "admin"), myEnrollments);

export default router;
