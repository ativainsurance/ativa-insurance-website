"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendChatLeadEmail } from "@/lib/emailjs";
import type { Mode } from "@/types";
import type { ChatMessage } from "@/app/api/chat/route";

interface ChatWidgetProps {
  mode: Mode;
}

/* ─── Lead data collected during conversation ─────────────────────────────── */
interface LeadData {
  name:      string;
  phone:     string;
  product:   string;
  bestTime:  string;
}

/* ─── Greeting text per mode ─────────────────────────────────────────────── */
function buildGreeting(isPersonal: boolean): string {
  const role = isPersonal
    ? "your Ativa Insurance assistant"
    : "Ativa's business insurance assistant";
  return (
    `Hi! I'm Flow, ${role} 👋\n\n` +
    `I can help you:\n` +
    `• Get a free insurance quote\n` +
    `• Find the right coverage for your needs\n` +
    `• Answer questions about your policy\n\n` +
    `What brings you here today?`
  );
}

/* ─── Quick reply button definitions ────────────────────────────────────── */
interface QuickReply { key: string; label: string }

function buildQuickReplies(isPersonal: boolean): QuickReply[] {
  return isPersonal
    ? [
        { key: "quote",    label: "Get a Quote →" },
        { key: "question", label: "I have a question" },
        { key: "compare",  label: "Compare coverage options" },
      ]
    : [
        { key: "quote",    label: "Get a Business Quote →" },
        { key: "question", label: "I have a question" },
        { key: "compare",  label: "What coverage do I need?" },
      ];
}

/* ─── System prompt per language ─────────────────────────────────────────── */
function buildSystemPrompt(lang: string, mode: string): string {
  const greetings: Record<string, string> = {
    en: `You are Flow, a friendly insurance assistant for Ativa Insurance — an independent agency licensed in CT, FL, GA, MA, MD, NC, NJ, OH, PA, SC, and TN.
Your job is to have a short, warm conversation to collect a lead.
Follow these steps in order:
1. Greet the user and introduce yourself as Flow from Ativa Insurance.
2. Ask for their first name.
3. Ask for their phone number.
4. Ask what type of insurance they're interested in (${mode === "personal" ? "Auto, Home, Renters, Condo, Flood, or Bundle" : "BOP, General Liability, Commercial Auto, Workers Comp, Professional Liability, or Cyber"}).
5. Ask the best time for an agent to call them.
6. Thank them, confirm the info, and tell them an agent will reach out shortly.
When you have all 4 pieces of info, include this exact JSON block at the end of your final message (hidden from the user display):
LEAD_DATA:{"name":"...","phone":"...","product":"...","bestTime":"..."}
Keep responses short — 1-3 sentences max. Be friendly and professional. Never give actual insurance advice or quotes.`,

    pt: `Você é Flow, assistente de seguros da Ativa Insurance — uma agência independente licenciada em CT, FL, GA, MA, MD, NC, NJ, OH, PA, SC e TN.
Sua missão é ter uma conversa breve e calorosa para coletar informações de contato.
Siga estes passos:
1. Cumprimente o usuário e se apresente como Flow da Ativa Insurance.
2. Pergunte o primeiro nome.
3. Pergunte o número de telefone.
4. Pergunte qual tipo de seguro tem interesse (${mode === "personal" ? "Auto, Residencial, Inquilino, Condomínio, Inundação ou Bundle" : "BOP, Responsabilidade Geral, Auto Comercial, Compensação de Trabalhadores, Responsabilidade Profissional ou Cyber"}).
5. Pergunte o melhor horário para um agente ligar.
6. Agradeça, confirme as informações e diga que um agente entrará em contato em breve.
Quando tiver as 4 informações, inclua este JSON ao final da sua última mensagem:
LEAD_DATA:{"name":"...","phone":"...","product":"...","bestTime":"..."}
Respostas curtas — máximo 1-3 frases. Seja calorosa e profissional.`,

    es: `Eres Flow, asistente de seguros de Ativa Insurance — una agencia independiente licenciada en CT, FL, GA, MA, MD, NC, NJ, OH, PA, SC y CT.
Tu misión es tener una conversación breve y amigable para recopilar un contacto.
Sigue estos pasos:
1. Saluda al usuario y preséntate como Flow de Ativa Insurance.
2. Pregunta su nombre.
3. Pregunta su número de teléfono.
4. Pregunta qué tipo de seguro le interesa (${mode === "personal" ? "Auto, Hogar, Inquilino, Condominio, Inundación o Bundle" : "BOP, Responsabilidad General, Auto Comercial, Compensación Laboral, Responsabilidad Profesional o Cyber"}).
5. Pregunta el mejor horario para que un agente le llame.
6. Agradécele, confirma la información y dile que un agente se pondrá en contacto pronto.
Cuando tengas las 4 informaciones, incluye este JSON al final de tu último mensaje:
LEAD_DATA:{"name":"...","phone":"...","product":"...","bestTime":"..."}
Respuestas cortas — máximo 1-3 frases. Sé amable y profesional.`,
  };

  return greetings[lang] ?? greetings["en"];
}

/* ─── Product detection ──────────────────────────────────────────────────── */
interface ProductMatch {
  id:    string;
  label: string;
  tab:   "personal" | "commercial";
}

const PRODUCT_MAP: Array<{ pattern: RegExp; id: string; label: string; tab: "personal" | "commercial"; commercialOverride?: { id: string; label: string } }> = [
  { pattern: /\b(commercial auto|fleet)\b/i,                              id: "commercial-auto", label: "Commercial Auto",        tab: "commercial" },
  { pattern: /\b(builders risk|construction project)\b/i,                 id: "bop",             label: "Builders Risk",          tab: "commercial" },
  { pattern: /\b(workers[' ]?comp(ensation)?|WC\b)\b/i,                   id: "workers-comp",    label: "Workers Comp",           tab: "commercial" },
  { pattern: /\b(professional liability|E&O|errors and omissions)\b/i,    id: "professional",    label: "Professional Liability", tab: "commercial" },
  { pattern: /\b(cyber([ -]liability)?|data breach)\b/i,                  id: "cyber",           label: "Cyber Liability",        tab: "commercial" },
  { pattern: /\b(general liability|GL insurance)\b/i,                     id: "gl",              label: "General Liability",      tab: "commercial" },
  { pattern: /\b(renters?|renting|apartment|tenant)\b/i,                  id: "renters",         label: "Renters",                tab: "personal"   },
  { pattern: /\b(pet|dog|cat|animal)\b/i,                                 id: "condo",           label: "Pet",                    tab: "personal"   },
  { pattern: /\bflood\b/i,                                                id: "flood",           label: "Flood",                  tab: "personal"   },
  { pattern: /\b(bundle|combine|multi[- ]policy|multiple policies)\b/i,   id: "bundle",          label: "Bundle",                 tab: "personal"   },
  { pattern: /\b(auto|car|vehicle|motorcycle|bike|truck)\b/i,             id: "auto",            label: "Auto",                   tab: "personal",  commercialOverride: { id: "commercial-auto", label: "Commercial Auto" } },
  { pattern: /\b(home|house|property|homeowner|homeowners|dwelling)\b/i,  id: "home",            label: "Property",               tab: "personal"   },
  { pattern: /\bliability\b/i,                                            id: "gl",              label: "General Liability",      tab: "commercial" },
];

function detectProducts(text: string, mode: Mode): ProductMatch[] {
  const found: ProductMatch[] = [];
  const seen = new Set<string>();

  for (const entry of PRODUCT_MAP) {
    if (entry.pattern.test(text)) {
      // For "truck/auto/car/vehicle" keywords, use commercial-auto in commercial mode
      let { id, label, tab } = entry;
      if (mode === "commercial" && entry.commercialOverride) {
        id    = entry.commercialOverride.id;
        label = entry.commercialOverride.label;
        tab   = "commercial";
      }
      if (!seen.has(id)) {
        seen.add(id);
        found.push({ id, label, tab });
      }
    }
  }
  return found;
}

/* ─── Strip LEAD_DATA from displayed message ─────────────────────────────── */
function stripLeadData(text: string): string {
  return text.replace(/LEAD_DATA:\{[^}]*\}/g, "").trim();
}

/* ─── Extract LEAD_DATA JSON from message ────────────────────────────────── */
function extractLeadData(text: string): LeadData | null {
  const match = text.match(/LEAD_DATA:(\{[^}]*\})/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as LeadData;
  } catch {
    return null;
  }
}

/* ─── Typing indicator ───────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 inline-block"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget({ mode }: ChatWidgetProps) {
  const { lang } = useLanguage();
  const [open, setOpen]                         = useState(false);
  const [messages, setMessages]                 = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal]                 = useState("");
  const [loading, setLoading]                   = useState(false);
  const [leadCaptured, setLeadCaptured]         = useState(false);
  const [emailSent, setEmailSent]               = useState(false);
  const [hasGreeted, setHasGreeted]             = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showCoverageButtons, setShowCoverageButtons] = useState(false);
  const [messageCtas, setMessageCtas]           = useState<Map<number, ProductMatch[]>>(new Map());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const isPersonal = mode === "personal";
  const accentBg   = isPersonal ? "#1B3A6B" : "#F5C400";
  const accentText = isPersonal ? "#FFFFFF"  : "#111111";
  const headerBg   = isPersonal ? "#1B3A6B"  : "#111111";

  /* Auto-scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showQuickReplies, showCoverageButtons, messageCtas]);

  /* Focus input when opened */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  /* Open handler — inject greeting only on first open */
  const handleOpen = () => {
    setOpen(true);
    if (!hasGreeted) {
      setHasGreeted(true);
      setMessages([{ role: "assistant" as const, content: buildGreeting(isPersonal) }]);
      setShowQuickReplies(true);
    }
  };

  /* Inject a hardcoded user + Flow exchange without calling the API */
  const injectExchange = (userText: string, flowText: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user" as const,      content: userText },
      { role: "assistant" as const, content: flowText  },
    ]);
  };

  /* Quick reply click handler */
  const handleQuickReply = (key: string) => {
    setShowQuickReplies(false);

    if (key === "quote") {
      // Signal the page to open the appropriate quote modal
      window.dispatchEvent(
        new CustomEvent("ativa:openQuote", { detail: isPersonal ? "personal" : "commercial" })
      );
      return;
    }

    if (key === "question") {
      injectExchange(
        "I have a question",
        "Of course! What would you like to know? I'm here to help."
      );
      return;
    }

    if (key === "compare") {
      injectExchange(
        isPersonal ? "Compare coverage options" : "What coverage do I need?",
        "I can help with that. Are you looking for personal coverage (auto, home, renters) or business coverage (GL, commercial auto, workers comp)?"
      );
      setShowCoverageButtons(true);
    }
  };

  /* Coverage choice (Personal / Commercial) */
  const handleCoverageChoice = (tab: "personal" | "commercial") => {
    setShowCoverageButtons(false);
    window.dispatchEvent(new CustomEvent("ativa:openQuote", { detail: tab }));
  };

  /* Product CTA click — close chat and open the specific quote form */
  const handleCtaClick = (productId: string, tab: "personal" | "commercial") => {
    setOpen(false);
    window.dispatchEvent(
      new CustomEvent("ativa:openQuote", { detail: { tab, productId } })
    );
  };

  const sendMessage = useCallback(async () => {
    const text = inputVal.trim();
    if (!text || loading) return;

    // Dismiss quick replies / coverage buttons when user types
    setShowQuickReplies(false);
    setShowCoverageButtons(false);

    const userMessage: ChatMessage = { role: "user" as const, content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputVal("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          systemPrompt: buildSystemPrompt(lang, mode),
        }),
      });
      const data = await res.json() as { reply?: string };
      const reply = data.reply ?? "Sorry, I had trouble responding. Please try again.";

      setMessages((prev) => {
        const updated = [...prev, { role: "assistant" as const, content: reply }];
        // Detect products from user text and attach CTAs to this assistant message
        const ctaMatches = detectProducts(text, mode);
        if (ctaMatches.length > 0) {
          const assistantIndex = updated.length - 1;
          setMessageCtas((prevMap) => {
            const next = new Map(prevMap);
            next.set(assistantIndex, ctaMatches);
            return next;
          });
        }
        return updated;
      });

      // Check if lead data is present and not already sent
      if (!leadCaptured) {
        const lead = extractLeadData(reply);
        if (lead && !emailSent) {
          setLeadCaptured(true);
          setEmailSent(true);
          try {
            await sendChatLeadEmail({
              lead_name:      lead.name,
              lead_phone:     lead.phone,
              lead_product:   lead.product,
              lead_best_time: lead.bestTime,
              lead_language:  lang.toUpperCase(),
              lead_mode:      mode === "personal" ? "Personal Lines" : "Commercial Lines",
              timestamp:      new Date().toLocaleString("en-US", { timeZone: "America/New_York" }) + " ET",
              to_email:       "info@ativainsurance.com",
            });
          } catch (e) {
            console.error("[Ativa Chat] Failed to send lead email:", e);
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant" as const,
        content: "Sorry, something went wrong. Please try WhatsApp instead.",
      }]);
    }

    setLoading(false);
  }, [inputVal, loading, messages, lang, mode, leadCaptured, emailSent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = buildQuickReplies(isPersonal);

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes chat-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chat-enter { animation: chat-slide-up 0.25s ease; }

        @keyframes greeting-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .greeting-bubble { animation: greeting-in 0.25s ease-out 0.15s both; }

        @keyframes quick-reply-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .quick-reply-btn { animation: quick-reply-in 0.2s ease-out both; }
        .quick-reply-btn:hover {
          background-color: #F4F6F8 !important;
          border-color: #F5A623 !important;
        }

        .chat-cluster { bottom: 88px; }
        @media (min-width: 769px) { .chat-cluster { bottom: 16px; } }
      `}</style>

      {/* ── Floating button cluster (bottom-right) ── */}
      <div className="chat-cluster fixed right-4 flex flex-col items-end gap-3" style={{ zIndex: 1000 }}>

        {/* Chat panel */}
        {open && (
          <div
            className="chat-enter w-[340px] sm:w-[380px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
              maxHeight: "520px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 shrink-0"
              style={{ backgroundColor: headerBg }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base"
                  style={{ backgroundColor: accentBg === "#1B3A6B" ? "#2451A0" : "#F5C400", color: accentText }}
                >
                  A
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Flow</p>
                  <p className="text-white/60 text-xs">Ativa Insurance</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ backgroundColor: "#F8FAFF" }}
            >
              {messages.map((msg, i) => {
                const isUser     = msg.role === "user";
                const isGreeting = i === 0 && !isUser;
                const display    = stripLeadData(msg.content);
                const ctaBtns    = !isUser ? messageCtas.get(i) : undefined;
                return (
                  <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed${isGreeting ? " greeting-bubble" : ""}`}
                      style={
                        isUser
                          ? { backgroundColor: accentBg, color: accentText, borderBottomRightRadius: "4px" }
                          : { backgroundColor: "#FFFFFF", color: "#1A1A1A", border: "1px solid #E2E8F0", borderBottomLeftRadius: "4px", whiteSpace: "pre-line" }
                      }
                    >
                      {display}

                      {/* WhatsApp CTA after lead captured */}
                      {!isUser && leadCaptured && i === messages.length - 1 && (
                        <a
                          href="https://wa.me/13213448474"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                          style={{ backgroundColor: "#25D366" }}
                        >
                          <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 shrink-0">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Continue on WhatsApp
                        </a>
                      )}
                    </div>

                    {/* ── Product CTA buttons ── */}
                    {ctaBtns && ctaBtns.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                        {ctaBtns.map((cta) => (
                          <button
                            key={cta.id}
                            type="button"
                            onClick={() => handleCtaClick(cta.id, cta.tab)}
                            style={{
                              background: "#F5A623",
                              border: "none",
                              color: "#111111",
                              borderRadius: "20px",
                              padding: "7px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Get {cta.label} Quote →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ── Quick reply buttons ── */}
              {showQuickReplies && (
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((btn, i) => (
                    <button
                      key={btn.key}
                      type="button"
                      onClick={() => handleQuickReply(btn.key)}
                      className="quick-reply-btn"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        color: "#0F2A44",
                        borderRadius: "20px",
                        padding: "8px 16px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        animationDelay: `${0.30 + i * 0.08}s`,
                        transition: "background-color 0.15s, border-color 0.15s",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Personal / Commercial choice buttons ── */}
              {showCoverageButtons && (
                <div className="flex flex-wrap gap-2">
                  {(["personal", "commercial"] as const).map((tab, i) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleCoverageChoice(tab)}
                      className="quick-reply-btn"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        color: "#0F2A44",
                        borderRadius: "20px",
                        padding: "8px 16px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        animationDelay: `${i * 0.08}s`,
                        transition: "background-color 0.15s, border-color 0.15s",
                      }}
                    >
                      {tab === "personal" ? "Personal" : "Commercial"}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <TypingDots />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 border-t flex items-center gap-2 shrink-0"
              style={{ borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  lang === "pt" ? "Digite uma mensagem…"
                  : lang === "es" ? "Escribe un mensaje…"
                  : "Type a message…"
                }
                className="flex-1 px-3 py-2.5 rounded-xl border-2 text-sm text-gray-900 bg-white placeholder-gray-400 outline-none focus:border-blue-400 transition-colors duration-150"
                style={{ borderColor: "#E2E8F0", fontSize: "16px" }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputVal.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150 disabled:opacity-40"
                style={{ backgroundColor: accentBg, color: accentText }}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Button row: WhatsApp + Chat ── */}
        <div className="flex items-center gap-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/13213448474"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>

          {/* AI Chat toggle */}
          <button
            onClick={open ? () => setOpen(false) : handleOpen}
            aria-label="Chat with Flow"
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 relative"
            style={{ backgroundColor: accentBg }}
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke={accentText} strokeWidth="2" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill={accentText} className="w-6 h-6">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            )}
            {/* Notification dot — shown until first open */}
            {!open && !hasGreeted && (
              <span
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{ backgroundColor: "#EF4444" }}
              />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
