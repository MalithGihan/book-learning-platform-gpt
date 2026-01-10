
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { acceptAll, rejectOptional, saveCustom } from "./consentSlice";


export default function CookieConsentBanner() {
  const dispatch = useAppDispatch();
  const consent = useAppSelector((s) => s.consent.consent);

  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const shouldShow = useMemo(() => consent == null, [consent]);

  if (!shouldShow) return null;

  function onCustomize() {
    setOpen(true);
  }

  function onSave() {
    dispatch(saveCustom({ analytics, marketing }));
    setOpen(false);
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              We use cookies to improve your experience.
              <span className="block text-xs text-slate-500 my-1">
                They help us remember your preferences and measure site usage.
              </span>
              <a
                href="/privacy"
                className="underline underline-offset-2 hover:text-slate-800"
              >
                Learn more
              </a>
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => dispatch(rejectOptional())}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                Reject
              </button>
              <button
                onClick={onCustomize}
                className="px-3 py-1.5 text-sm bg-zinc-100 rounded text-slate-600 hover:text-slate-900"
              >
                Customize
              </button>
              <button
                onClick={() => dispatch(acceptAll())}
                className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-slate-900">Cookie Settings</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <PrefRow label="Necessary" desc="Required" disabled checked />
              <PrefRow
                label="Analytics"
                desc="Usage data"
                checked={analytics}
                onChange={setAnalytics}
              />
              <PrefRow
                label="Marketing"
                desc="Personalized ads"
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PrefRow(props: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <div>
        <div className="text-sm font-medium text-slate-900">{props.label}</div>
        <div className="text-xs text-slate-500">{props.desc}</div>
      </div>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={props.checked}
        disabled={props.disabled}
        onChange={(e) => props.onChange?.(e.target.checked)}
      />
    </label>
  );
}
