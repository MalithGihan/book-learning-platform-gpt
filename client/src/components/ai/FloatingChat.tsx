/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { useAiChatMutation } from "../../features/ai/aiApi";

type Msg = { id: string; role: "user" | "assistant"; text: string };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const user = useAppSelector((s) => s.auth.user);
  const [aiChat, { isLoading }] = useAiChatMutation();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (panel.contains(e.target as Node)) return;

      // Close chat, but DO NOT block the click on the page
      setTimeout(() => setOpen(false), 0);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const context = useMemo(
    () => ({ role: user?.role, email: user?.email }),
    [user?.role, user?.email]
  );

  function scrollToEnd() {
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    );
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
        e?.data?.error ||
        e?.error ||
        "AI is not available right now (check API key).";
      setMsgs((m) => [
        ...m,
        { id: id + "-a", role: "assistant", text: `⚠️ ${errText}` },
      ]);
    } finally {
      scrollToEnd();
    }
  }

  const suggestedQuestions = [
    "What courses are available?",
    "How do I enroll in a course?",
    "What's my learning progress?",
    "Recommend courses for beginners",
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] text-black  hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute top-1 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:items-end md:justify-end md:p-6 pointer-events-none">
          
          <button
            type="button"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close overlay"
          />

          <aside
            ref={panelRef as any}
            className="pointer-events-auto relative w-full h-full
                 md:h-150 md:w-100 md:rounded-md
                 shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]
                 flex flex-col overflow-hidden"
          >
            <div
              className="relative bg-linear-to-r from-white/30 to-black/10 backdrop-blur-sm
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] px-4 py-4 text-black"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">Book Assistant</h2>
                    <p className="text-xs text-black/80">Always here to help</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {msgs.length === 0 ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#4CE38F] to-[#3AB574] flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-900 leading-relaxed">
                        Hi! I'm your Book AI assistant. I can help you with
                        courses, enrollment, and learning guidance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 px-2">
                      Suggested questions:
                    </p>
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setText(q);
                          setTimeout(() => onSend(), 100);
                        }}
                        className="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#4CE38F] hover:bg-[#4CE38F]/5 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-start gap-3 ${
                        m.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          m.role === "user" ? "bg-gray-900" : "bg-[#4CE38F]"
                        }`}
                      >
                        {m.role === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>

                      <div
                        className={`flex-1 max-w-[75%] ${
                          m.role === "user"
                            ? "bg-gray-900 text-white rounded-2xl rounded-tr-none"
                            : "bg-white text-gray-900 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm"
                        } p-3`}
                      >
                        <p className="text-xs leading-relaxed whitespace-pre-wrap wrap-break-word">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#4CE38F] flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
                        <div className="flex gap-1">
                          <span
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
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
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={onSend}
                  disabled={isLoading || !text.trim()}
                  className="px-4 py-2.5 rounded bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
