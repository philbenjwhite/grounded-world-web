/*
 * PLACEHOLDER COMPONENT — Gaia Chat UI
 * This is a static UI mockup for engineer handoff / design review.
 * It will be replaced with the production chat iframe or embed once
 * the Gaia backend API is integrated. The stub setTimeout in send()
 * should be swapped with the real API call.
 *
 * Styles: GaiaChat.module.css (co-located, kept as a separate file)
 */
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import cn from "classnames";
import {
  ArrowUpIcon,
} from "@phosphor-icons/react";
import styles from "./GaiaChat.module.css";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "bot",
  text: "What would you like to know?",
};

const STUB_REPLY =
  "Thanks for reaching out! At Grounded World we help purpose-driven " +
  "organizations amplify their impact through research, strategy, and activation. " +
  "Ask me anything about sustainability, B Corp certification, or how we can support your mission.";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const GaiaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(1);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  }, []);

  const send = useCallback(() => {
    const txt = input.trim();
    if (!txt || thinking) return;
    setInput("");

    const userMsg: Message = {
      id: `msg-${idCounter.current++}`,
      role: "user",
      text: txt,
    };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    scrollToBottom();

    // Stub response — replace with actual API call
    setTimeout(() => {
      const botMsg: Message = {
        id: `msg-${idCounter.current++}`,
        role: "bot",
        text: STUB_REPLY,
      };
      setMessages((prev) => [...prev, botMsg]);
      setThinking(false);
      scrollToBottom();
    }, 1800);
  }, [input, thinking, scrollToBottom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") send();
    },
    [send],
  );

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking, scrollToBottom]);

  return (
    <div className={cn(styles.chatShell, "w-full h-[min(70vh,600px)] md:h-[min(80vh,750px)]")}>
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Messages */}
        <div className={styles.messagesWrap}>
          <div
            ref={messagesRef}
            className={cn(
              styles.messages,
              "h-full overflow-y-auto py-6 px-6 md:px-10 flex flex-col gap-5",
            )}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={cn(
                  styles.msgRow,
                  "flex flex-col max-w-[85%] md:max-w-[70%]",
                  msg.role === "bot" ? "self-start" : "self-end items-end",
                )}
                style={idx === 0 ? { animationDelay: "0.15s" } : undefined}
              >
                {/* Sender label */}
                {msg.role === "bot" && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/gaia-ai.png"
                        alt="Gaia"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[12px] font-medium text-white/50">
                      Gaia
                    </span>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    styles.bubble,
                    "text-[14px] leading-[1.7] break-words",
                    msg.role === "bot"
                      ? cn(styles.botBubble, "text-white/80")
                      : cn(styles.userBubble, "text-white/90"),
                  )}
                  dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {thinking && (
              <div className={cn(styles.msgRow, "self-start flex flex-col")}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/gaia-ai.png"
                      alt=""
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[12px] font-medium text-white/50">
                    Gaia
                  </span>
                </div>
                <div
                  className={cn(
                    styles.thinkDots,
                    "flex gap-[5px] items-center py-3 px-4",
                  )}
                  aria-label="Gaia is typing"
                >
                  <span className={cn(styles.thinkDot, "w-[5px] h-[5px] rounded-full bg-white/40")} />
                  <span className={cn(styles.thinkDot, "w-[5px] h-[5px] rounded-full bg-white/40")} />
                  <span className={cn(styles.thinkDot, "w-[5px] h-[5px] rounded-full bg-white/40")} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className={cn(styles.staggerIn, "py-3 pb-5 px-6 md:px-10 shrink-0")} style={{ animationDelay: "0.4s" }}>
          <div
            className={cn(
              styles.inputRow,
              "flex items-center gap-2 bg-white/[0.06] rounded-2xl border border-white/[0.1] backdrop-blur-[40px] saturate-[1.6] shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]",
            )}
          >
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent border-none outline-none py-3 px-4 text-[14px] text-white/90 placeholder:text-white/25"
              placeholder="Ask Gaia anything..."
              autoComplete="off"
              aria-label="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className={cn(
                styles.sendBtn,
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-2 transition-all duration-200",
                input.trim()
                  ? "bg-white/15 text-white cursor-pointer hover:bg-white/25"
                  : "bg-transparent text-white/20 cursor-default",
              )}
              aria-label="Send message"
              onClick={send}
            >
              <ArrowUpIcon size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Footer disclaimer */}
        <footer className={cn(styles.staggerIn, "shrink-0 px-6 md:px-10 pb-3")} style={{ animationDelay: "0.6s" }}>
          <p className="text-[11px] leading-[1.5] text-white/15 text-center">
            Gaia may make mistakes. Verify important information.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default GaiaChat;
