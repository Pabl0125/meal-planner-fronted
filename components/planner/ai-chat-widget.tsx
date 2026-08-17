"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { sendChatMessage, ChatAction } from "@/lib/api/chat"
import { Dish, DayOfWeek, MealType, WeeklyPlan } from "@/types/planner"

interface Message {
  role: "user" | "ai"
  text: string
}

interface AiChatWidgetProps {
  dishes: Dish[]
  plan: WeeklyPlan
  onExecuteAction: (action: ChatAction) => void
}

export function AiChatWidget({ dishes, plan, onExecuteAction }: AiChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hola! Soy tu asistente de IA. Como puedo ayudarte a organizar el menu de la semana?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateContext = () => {
    const dishList = dishes.map(d => `- ${d.title}`).join("\n")
    let planContext = "Current dashboard schedule:\n"
    for (const [day, meals] of Object.entries(plan)) {
      planContext += `${day}:\n`
      if (meals.Lunch) planContext += `  Lunch: ${meals.Lunch.title}\n`
      else planContext += `  Lunch: (Empty)\n`
      if (meals.Dinner) planContext += `  Dinner: ${meals.Dinner.title}\n`
      else planContext += `  Dinner: (Empty)\n`
    }

    return `Available dishes to choose from:\n${dishList}\n\n${planContext}`
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setIsLoading(true)

    try {
      const response = await sendChatMessage(userMsg, generateContext(), "session-123") // Hardcoded session for now
      
      setMessages(prev => [...prev, { role: "ai", text: response.text }])

      // Execute any actions returned by the AI
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach(action => onExecuteAction(action))
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setMessages(prev => [...prev, { role: "ai", text: `Lo siento, Estoy teniendo problemas para conectarme al servidor ahora mismo.\n\nError: ${errorMessage}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-on-background text-background p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-background border border-outline/30 rounded-2xl shadow-2xl w-87.5 h-125 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-surface-container px-4 py-3 border-b border-outline/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-on-surface" />
              <h3 className="font-semibold text-sm text-on-surface">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-on-surface transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-on-background text-background self-end rounded-tr-sm"
                    : "bg-surface-container text-on-surface self-start rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-surface-container text-on-surface self-start p-3 rounded-2xl rounded-tl-sm w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-outline/30 bg-surface flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., Pon Pizza el miercoles..."
              className="flex-1 bg-background border border-outline/50 rounded-full px-4 py-2 text-sm outline-none focus:border-on-surface text-on-background placeholder:text-secondary transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-on-background text-background p-2 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center min-w-10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
