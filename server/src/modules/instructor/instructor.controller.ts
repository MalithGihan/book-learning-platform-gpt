import type { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";
import { Course } from "../../models/Course";

export async function getInstructorEnrollmentStats(req: any, res: any, next: any) {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    const createdBy = new mongoose.Types.ObjectId(String(userId));

    const rows = await Course.aggregate([
      { $match: { createdBy } },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          enrolledCount: {
            $size: {
              $filter: {
                input: "$enrollments",
                as: "e",
                cond: { $eq: ["$$e.status", "enrolled"] },
              },
            },
          },
          totalEnrollments: { $size: "$enrollments" },
        },
      },
      {
        $project: {
          title: 1,
          status: 1,
          enrolledCount: 1,
          totalEnrollments: 1,
        },
      },
      { $sort: { enrolledCount: -1 } },
    ]);

    return res.json({ ok: true, courses: rows });
  } catch (err) {
    next(err);
  }
}
