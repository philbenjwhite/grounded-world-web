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
  SparkleIcon,
  UserIcon,
  PaperPlaneTiltIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  DotsThreeIcon,
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
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [greetingMounted, setGreetingMounted] = useState(true);
  const [muted, setMuted] = useState(false);
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

    // Hide greeting on first user message
    if (greetingVisible) {
      setGreetingVisible(false);
      setTimeout(() => setGreetingMounted(false), 300);
    }

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
  }, [input, thinking, greetingVisible, scrollToBottom]);

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
    <div className={cn(styles.cardShell, "w-full h-[min(75vh,700px)]")}>
      {/* Ambient gold glow */}
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className="relative z-[2] flex flex-col flex-1 overflow-hidden">
        {/* Top stripe */}
        <div className={styles.topStripe} aria-hidden="true" />

        {/* Body row: chat + avatar */}
        <div className="flex flex-1 overflow-hidden relative min-h-0">
          {/* Kebab menu */}
          <div className="absolute top-4 right-4 z-30">
            <button
              className="bg-transparent border-none text-[var(--color-gray-4)] text-[22px] cursor-pointer px-2 py-1 rounded hover:text-white transition-colors duration-200"
              aria-label="More options"
              aria-haspopup="true"
            >
              <DotsThreeIcon size={22} weight="bold" />
            </button>
          </div>

          {/* Chat column */}
          <div className="flex-1 flex flex-col overflow-hidden px-8 min-w-0">
            {/* Greeting */}
            {greetingMounted && (
              <h1
                className={cn(
                  styles.greeting,
                  "text-[28px] md:text-[38px] font-bold text-white tracking-[-0.02em] leading-[1.1] mt-9 shrink-0",
                  !greetingVisible && styles.greetingHide,
                )}
              >
                Hello, I&rsquo;m Gaia.
              </h1>
            )}

            {/* Messages — wrapped with top/bottom fade overlays */}
            <div className={styles.messagesWrap}>
              <div
                ref={messagesRef}
                className={cn(
                  styles.messages,
                  "h-full overflow-y-auto py-5 flex flex-col gap-3",
                )}
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      styles.msgRow,
                      "flex items-end gap-2 max-w-[78%]",
                      msg.role === "bot"
                        ? "self-start flex-row"
                        : "self-end flex-row-reverse",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === "bot"
                          ? "bg-[var(--color-gold)]"
                          : "bg-gradient-to-br from-[#d94f47] to-[#b02c2c]",
                      )}
                      aria-label={msg.role === "bot" ? "Gaia" : "You"}
                    >
                      {msg.role === "bot" ? (
                        <SparkleIcon size={16} weight="fill" className="text-[#1a0f00]" />
                      ) : (
                        <UserIcon size={16} weight="fill" className="text-white/85" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "py-[11px] px-[15px] rounded-[18px] text-[15px] leading-[1.6] max-w-full break-words",
                        msg.role === "bot"
                          ? cn(styles.botBubble, "text-[#ededed]")
                          : cn(styles.userBubble, "text-white"),
                      )}
                      dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }}
                    />
                  </div>
                ))}

                {/* Typing indicator */}
                {thinking && (
                  <div className={cn(styles.msgRow, "self-start flex items-center gap-2 py-1")}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[var(--color-gold)]"
                      aria-hidden="true"
                    >
                      <SparkleIcon size={14} weight="fill" className="text-[#1a0f00]" />
                    </div>
                    <div
                      className={cn(
                        styles.thinkDots,
                        "flex gap-1 items-center rounded-[18px] py-[10px] px-[14px]",
                      )}
                      aria-label="Gaia is typing"
                    >
                      <span className={cn(styles.thinkDot, "w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] opacity-50")} />
                      <span className={cn(styles.thinkDot, "w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] opacity-50")} />
                      <span className={cn(styles.thinkDot, "w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] opacity-50")} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input bar */}
            <div className="py-[10px] pb-[18px] shrink-0">
              <div
                className={cn(
                  styles.inputRow,
                  "flex items-center bg-[#1e1d1d] border border-white/[0.08] rounded-3xl overflow-hidden",
                )}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none py-3.5 px-[18px] text-[15px] font-[Arial,Helvetica,sans-serif] text-white placeholder:text-[var(--color-gray-4)]"
                  placeholder="Your message"
                  autoComplete="off"
                  aria-label="Type a message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="bg-transparent border-none py-3 px-4 cursor-pointer text-[var(--color-gray-4)] flex items-center shrink-0 transition-colors duration-200 hover:text-[var(--color-gold)] active:scale-90"
                  aria-label="Send message"
                  onClick={send}
                >
                  <PaperPlaneTiltIcon size={20} weight="fill" />
                </button>
              </div>
            </div>
          </div>

          {/* Avatar panel — hidden on mobile */}
          <div className="hidden lg:block w-[320px] shrink-0 relative overflow-hidden">
            {/* Placeholder portrait — replace with final Gaia asset */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1510] to-[#0d0b08] flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center">
                <SparkleIcon size={40} weight="fill" className="text-[var(--color-gold)]/60" />
              </div>
            </div>

            {/* Sound toggle */}
            <button
              className={cn(
                styles.micBtn,
                "absolute bottom-[72px] left-3.5 w-11 h-11 bg-[rgba(15,15,15,0.85)] border border-white/[0.14] rounded-[10px] flex items-center justify-center cursor-pointer z-10 text-[var(--color-gray-3)]",
                muted && styles.micMuted,
              )}
              aria-label="Toggle sound"
              aria-pressed={muted}
              onClick={() => setMuted((v) => !v)}
            >
              {muted ? (
                <SpeakerSlashIcon size={20} weight="regular" />
              ) : (
                <SpeakerHighIcon size={20} weight="regular" />
              )}
            </button>
          </div>
        </div>

        {/* Footer disclaimer */}
        <footer className="shrink-0 px-8 py-[9px] pb-[13px] border-t border-white/[0.04]">
          <p className="text-[11px] leading-[1.6] text-[var(--color-gray-4)]">
            The information provided by GAIA is for general informational purposes only
            and should not be construed as legal advice. You should consult with an
            attorney licensed in your jurisdiction before making any legal decisions.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default GaiaChat;
