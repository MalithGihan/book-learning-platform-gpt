import { ShieldAlert } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-row gap-4 items-center mb-8 p-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
      <ShieldAlert />
      <p className="font-normal text-sm">
        Failed to load courses. Please try again.
      </p>
    </div>
  );
}
