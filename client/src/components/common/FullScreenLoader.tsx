export default function FullScreenLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-999 grid place-items-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}
