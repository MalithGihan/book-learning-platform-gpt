import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth";
import { requireRole } from "../../middlewares/requireRole";
import { getInstructorEnrollmentStats } from "./instructor.controller";

const router = Router();

router.get("/enrollment-stats", requireAuth, requireRole("instructor"), getInstructorEnrollmentStats);

export default router;
