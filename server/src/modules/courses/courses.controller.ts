import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Course } from "../../models/Course";
import { CreateCourseSchema, UpdateCourseSchema } from "./courses.schema";
import { Enrollment } from "../../models/Enrollment";

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = CreateCourseSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ ok: false, error: "Invalid payload" });

    const course = await Course.create({
      ...parsed.data,
      createdBy: new mongoose.Types.ObjectId(req.user!.id),
    });

    return res.status(201).json({ ok: true, course });
  } catch (err) {
    next(err);
  }
}

export async function listCourses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    const createdBy =
      typeof req.query.createdBy === "string" ? req.query.createdBy : undefined;
    const publishedQ =
      typeof req.query.published === "string" ? req.query.published : undefined;

    const filter: Record<string, any> = {};

    if (!role || role === "student") {
      filter.published = true;
    } else if (role === "instructor") {
      filter.createdBy = userId;
    } else if (role === "admin") {
      if (createdBy && mongoose.isValidObjectId(createdBy))
        filter.createdBy = createdBy;
      if (publishedQ === "true") filter.published = true;
      if (publishedQ === "false") filter.published = false;
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 }).lean();

    if (!userId || role !== "student" || courses.length === 0) {
      return res.json({
        ok: true,
        courses: courses.map((c) => ({ ...c, enrollmentStatus: null })),
      });
    }

    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      student: userId,
      course: { $in: courseIds },
    })
      .select("course status")
      .lean();

    const statusByCourse = new Map<string, string>();
    for (const e of enrollments) statusByCourse.set(String(e.course), e.status);

    const merged = courses.map((c) => ({
      ...c,
      enrollmentStatus: statusByCourse.get(String(c._id)) || null,
    }));

    return res.json({ ok: true, courses: merged });
  } catch (err) {
    next(err);
  }
}

export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).lean();
    if (!course)
      return res.status(404).json({ ok: false, error: "Course not found" });
    return res.json({ ok: true, course });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = UpdateCourseSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ ok: false, error: "Invalid payload" });

    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!course)
      return res.status(404).json({ ok: false, error: "Course not found" });

    return res.json({ ok: true, course });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course)
      return res.status(404).json({ ok: false, error: "Course not found" });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
