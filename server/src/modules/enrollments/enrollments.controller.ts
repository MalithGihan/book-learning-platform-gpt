import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Enrollment } from "../../models/Enrollment";
import { Course } from "../../models/Course";

export async function enrollInCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ ok: false, error: "Invalid courseId" });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ ok: false, error: "Course not found" });

    const studentId = new mongoose.Types.ObjectId(req.user!.id);

    try {
      const enrollment = await Enrollment.create({
        student: studentId,
        course: course._id,
        status: "enrolled",
      });

      return res.status(201).json({
        ok: true,
        message: "Enrollment completed successfully",
        enrollment,
      });
    } catch (e: any) {
      if (e?.code === 11000) {
        return res.status(409).json({ ok: false, error: "Already enrolled" });
      }
      throw e;
    }
  } catch (err) {
    next(err);
  }
}

export async function myEnrollments(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = req.user!.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .sort({ createdAt: -1 })
      .populate("course") 
      .lean();

    return res.json({ ok: true, enrollments });
  } catch (err) {
    next(err);
  }
}
