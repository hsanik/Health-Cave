"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";

const CustomChatbot = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HealthCave AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingFlow, setBookingFlow] = useState(null); // { step: 'specialty' | 'date', specialty: string }
  const [findFlow, setFindFlow] = useState(null); // { step: 'query' }
  const [bookingOptions, setBookingOptions] = useState(null); // { doctorId, specialty, date, slots: string[] }
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e, overrideText) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const chosenText = (overrideText ?? inputValue).trim();
    if (!chosenText || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: chosenText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    // Booking flow handling
    if (bookingFlow?.step === "specialty") {
      const specialtyValue = chosenText;
      setInputValue("");
      const botAskDate = {
        id: messages.length + 2,
        text: `Great. What date do you prefer for ${specialtyValue}? (YYYY-MM-DD)`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botAskDate]);
      setBookingFlow({ step: "date", specialty: specialtyValue });
      return;
    }

    if (bookingFlow?.step === "date") {
      const dateValue = chosenText;
      setInputValue("");
      setIsLoading(true);
      try {
        const search = await fetch("/api/tools/search-doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialty: bookingFlow.specialty, limit: 1 }),
        });
        const { doctors: found } = await search.json();
        const doctorId = found?.[0]?.id || found?.[0]?._id;

        if (!doctorId) {
          const noDoc = {
            id: messages.length + 2,
            text: `I couldn't find a doctor for ${bookingFlow.specialty}. Try another specialty.`,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, noDoc]);
          return;
        }

        const resp = await fetch("/api/tools/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId, date: dateValue }),
        });
        const data = await resp.json();
        const slotsText =
          Array.isArray(data.slots) && data.slots.length > 0
            ? `Here are available slots for ${
                bookingFlow.specialty
              } on ${dateValue}:\n- ${data.slots.join(
                "\n- "
              )}\nYou can continue booking on the Doctors page.`
            : `I couldn't find available slots for ${bookingFlow.specialty} on ${dateValue}. Try another date or specialty.`;
        const botSlots = {
          id: messages.length + 2,
          text: slotsText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botSlots]);
        if (Array.isArray(data.slots) && data.slots.length > 0) {
          setBookingOptions({ doctorId, specialty: bookingFlow.specialty, date: dateValue, slots: data.slots });
          // Stay in chat; navigate only after booking or explicit user action
        }
      } catch (err) {
        console.error("check-availability error", err);
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, there was a problem fetching availability. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setBookingFlow(null);
      }
      return;
    }

    // Find doctor flow handling
    if (findFlow?.step === "query") {
      const queryValue = chosenText;
      setInputValue("");
      setIsLoading(true);
      try {
        const resp = await fetch("/api/tools/search-doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryValue,
            specialty: queryValue,
            limit: 3,
          }),
        });
        const data = await resp.json();
        const hasResults =
          Array.isArray(data.doctors) && data.doctors.length > 0;
        const names = hasResults
          ? data.doctors
              .map((d) =>
                `${d.name} — ${d.specialization || d.specialty || ""}`.trim()
              )
              .join("\n")
          : "No matching doctors found. Try another name or specialty.";
        const botMessage = {
          id: messages.length + 2,
          text: hasResults ? `Top matches:\n${names}` : names,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        if (hasResults) {
          const first = data.doctors[0];
          const detailsId = first._id || first.id;
          // If it's a strong match (exact name) or only one result, go to details page
          const strongMatch =
            (first.name || "").toLowerCase() === queryValue.toLowerCase();
          if (data.doctors.length === 1 || strongMatch) {
            router.push(`/doctors/${detailsId}`);
          } else {
            // Otherwise open the list filtered view
            router.push(`/doctors?specialty=${encodeURIComponent(queryValue)}`);
          }
        }
      } catch (err) {
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I could not search doctors right now. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setFindFlow(null);
      }
      return;
    }

    // Intent detection before hitting API
    const handled = handleIntents(chosenText);
    if (handled) {
      setInputValue("");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual OpenAI API call
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chosenText,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text:
          data.reply ||
          "I apologize, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = async (time) => {
    if (!bookingOptions) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/tools/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: bookingOptions.doctorId, date: bookingOptions.date, time })
      })
      if (res.status === 401) {
        const msg = { id: messages.length + 1, text: 'Please log in to book an appointment.', sender: 'bot', timestamp: new Date() };
        setMessages((prev) => [...prev, msg]);
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.booked) {
        const msg = { id: messages.length + 1, text: `Your appointment is booked for ${bookingOptions.date} at ${time}.`, sender: 'bot', timestamp: new Date() };
        setMessages((prev) => [...prev, msg]);
        setBookingOptions(null);
      } else {
        const msg = { id: messages.length + 1, text: 'Unable to book right now. Please try another slot.', sender: 'bot', timestamp: new Date() };
        setMessages((prev) => [...prev, msg]);
      }
    } catch (e) {
      const msg = { id: messages.length + 1, text: 'Booking failed. Please try again later.', sender: 'bot', timestamp: new Date() };
      setMessages((prev) => [...prev, msg]);
    } finally {
      setIsLoading(false);
    }
  }

  // Simple intent detection and routing
  const handleIntents = (text) => {
    const lower = text.toLowerCase();
    // Find doctor intent
    if (
      /(find|search).*(doctor|specialist)|\bdoctor\b|\bspecialist\b/.test(lower)
    ) {
      const bot = {
        id: messages.length + 2,
        text: "What name or specialty should I search for?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, bot]);
      setFindFlow({ step: "query" });
      return true;
    }
    // Records intent
    if (/record|report|history/.test(lower)) {
      const bot = {
        id: messages.length + 2,
        text: "Taking you to your medical records…",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, bot]);
      router.push("/dashboard/records");
      return true;
    }
    // Billing intent (fallback to dashboard)
    if (/bill|payment|invoice/.test(lower)) {
      const bot = {
        id: messages.length + 2,
        text: "Opening your billing section…",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, bot]);
      router.push("/dashboard");
      return true;
    }
    // Booking intent -> start flow
    if (/book|appointment|schedule/.test(lower)) {
      const bot = {
        id: messages.length + 2,
        text: "Sure — which specialty do you need? (e.g., cardiology, dermatology)",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, bot]);
      setBookingFlow({ step: "specialty" });
      return true;
    }
    return false;
  };

  const quickActions = [
    { id: 1, text: "Find a doctor", icon: "🩺" },
    { id: 2, text: "Book appointment", icon: "📅" },
    { id: 3, text: "View services", icon: "🏥" },
    { id: 4, text: "Contact us", icon: "📞" },
  ];

  const handleQuickAction = (actionText) => {
    // Send immediately
    handleSendMessage(null, actionText);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        }`}
        aria-label={isOpen ? "Minimize chat" : "Open chat"}
      >
        {isOpen ? (
          <MessageCircle className="w-6 h-6 text-white rotate-45" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[75vh] max-h-[600px] md:h-[80vh] md:max-h-[700px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
            {/* Always-visible close button in top-right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between pr-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HealthCave AI</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              {/* Spacer to keep layout consistent */}
              <div className="w-8 h-8" />
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-md">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              </div>
            )}

            {/* Booking slots quick actions */}
            {bookingOptions && Array.isArray(bookingOptions.slots) && bookingOptions.slots.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-md">
                <p className="text-sm mb-2 text-gray-700 dark:text-gray-200">Book now:</p>
                <div className="flex flex-wrap gap-2">
                  {bookingOptions.slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleBookNow(t)}
                      disabled={isLoading}
                      className="px-3 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 dark:border-blue-500 dark:text-blue-200 dark:hover:bg-blue-900/20"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - always visible */}
          <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quick actions:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.text)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  <span>{action.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {action.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CustomChatbot;
