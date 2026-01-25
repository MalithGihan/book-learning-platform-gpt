import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireRole } from "../../middlewares/requireRole";
import {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  listPublishedCourses,
} from "./courses.controller";
import { optionalAuth } from "../../middlewares/optionalAuth";

const router = Router();

// public reads
router.get("/", optionalAuth, listCourses);
router.get("/:id", getCourse);
router.get("/published", listPublishedCourses);

// protected writes
router.post("/", requireAuth, requireRole("instructor", "admin"), createCourse);
router.put(
  "/:id",
  requireAuth,
  requireRole("instructor", "admin"),
  updateCourse,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("instructor", "admin"),
  deleteCourse,
);

export default router;
