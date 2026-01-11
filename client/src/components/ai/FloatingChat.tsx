/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useAiChatMutation } from "../../features/ai/aiApi";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const user = useAppSelector((s) => s.auth.user);
  const [aiChat, { isLoading }] = useAiChatMutation();

  const context = useMemo(
    () => ({ role: user?.role, email: user?.email }),
    [user?.role, user?.email]
  );

  function scrollToEnd() {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  async function onSend() {
    const msg = text.trim();
    if (!msg || isLoading) return;

    const id = crypto.randomUUID?.() ?? String(Date.now());
    setMsgs((m) => [...m, { id, role: "user", text: msg }]);
    setText("");
    scrollToEnd();

    try {
      const res = await aiChat({ message: msg, context }).unwrap();
      const reply = res.reply || "(No reply)";
      setMsgs((m) => [...m, { id: id + "-a", role: "assistant", text: reply }]);
    } catch (e: any) {
      const errText =
        e?.data?.error || e?.error || "AI is not available right now (check API key).";
      setMsgs((m) => [
        ...m,
        { id: id + "-a", role: "assistant", text: `⚠️ ${errText}` },
      ]);
    } finally {
      scrollToEnd();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-60 h-12 w-12 rounded-full bg-gray-900 text-white shadow-lg hover:shadow-xl flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageSquare className="h-5 w-5" />
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-70">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Close overlay"
          />

          {/* panel */}
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="h-14 px-4 border-b flex items-center justify-between">
              <div className="font-semibold text-gray-900">BookLMS Assistant</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {msgs.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Ask something like: <br />
                  <span className="text-gray-900 font-medium">
                    “I want to be a software engineer, what courses should I follow?”
                  </span>
                </div>
              ) : (
                msgs.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "ml-auto bg-gray-900 text-white"
                        : "mr-auto bg-white text-gray-900 border"
                    }`}
                  >
                    {m.text}
                  </div>
                ))
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder="Type a message…"
                  className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-gray-900/10"
                />
                <button
                  type="button"
                  onClick={onSend}
                  disabled={isLoading || !text.trim()}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {isLoading && <div className="mt-2 text-xs text-gray-500">Thinking…</div>}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
