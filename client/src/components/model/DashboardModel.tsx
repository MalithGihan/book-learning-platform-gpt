import { X } from "lucide-react";

type DashboardModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function DashboardModal(props: DashboardModalProps) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={props.onClose}
        aria-label="Close modal"
      />
      <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <div className="text-sm font-semibold text-gray-900">
            {props.title}
          </div>
          <button
            onClick={props.onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="p-4">{props.children}</div>
      </div>
    </div>
  );
}
