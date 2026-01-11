import { useState } from "react";
import type { Course } from "./coursesApi";

export default function CourseForm(props: {
  initial?: Partial<Course>;
  submitLabel: string;
  onSubmit: (values: { title: string; description: string }) => Promise<void> | void;
  busy?: boolean;
}) {
  const [title, setTitle] = useState(props.initial?.title ?? "");
  const [description, setDescription] = useState(props.initial?.description ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        await props.onSubmit({ title: title.trim(), description: description.trim() });
      }}
    >
      <div>
        <label className="text-sm text-slate-700">Title</label>
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., MERN Masterclass"
        />
      </div>

      <div>
        <label className="text-sm text-slate-700">Description</label>
        <textarea
          className="mt-1 w-full rounded-lg border px-3 py-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short course description..."
        />
      </div>

      <button
        disabled={props.busy}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {props.busy ? "Saving..." : props.submitLabel}
      </button>
    </form>
  );
}
