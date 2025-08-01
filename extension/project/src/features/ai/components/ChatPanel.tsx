import { useState, useRef, useEffect } from "react"
import { useAction, useQuery } from "convex/react"
import { api } from "@/convex"
import { Button } from "../../../components/ui/button"
import { Textarea } from "../../../components/ui/textarea"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Send, Bot, User, Loader2, Plus, MessageSquare, X, ChevronDown } from "lucide-react"
import { cn } from "../../../lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: string
  suggestions?: string[]
}

interface Thread {
  id: string
  title: string
  active: boolean
}

interface ChatPanelProps {
  threads: Thread[]
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>
  activeThreadId: string
  setActiveThreadId: (id: string) => void
  onCanvasTypeChange: (type: string) => void
}

export function ChatPanel({ 
  threads, 
  setThreads, 
  activeThreadId, 
  setActiveThreadId,
  onCanvasTypeChange 
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you create documents, presentations, analyze data, and more. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: ["Create a document", "Generate a presentation", "Analyze data"]
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [threadsDropdownOpen, setThreadsDropdownOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const user = useQuery(api.auth.loggedInUser)
  const chatAgent = useAction(api.actions.agent.chatAgent)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatAgent({ message: input.trim() })
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.result,
        timestamp: new Date(),
        action: response.action,
        suggestions: response.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string, action?: string) => {
    if (suggestion.includes("document") || action === "document_creation") {
      onCanvasTypeChange("document")
    } else if (suggestion.includes("presentation") || action === "presentation_creation") {
      onCanvasTypeChange("presentation")
    } else if (suggestion.includes("data") || action === "data_query") {
      onCanvasTypeChange("data")
    } else if (suggestion.includes("video") || action === "video_creation") {
      onCanvasTypeChange("video")
    }
  }

  const createNewThread = () => {
    const newThreadId = (Date.now() + 1).toString()
    const newThread: Thread = {
      id: newThreadId,
      title: "New Chat",
      active: true
    }

    setThreads((prev: Thread[]) => prev.map((t: Thread) => ({ ...t, active: false })).concat(newThread))
    setActiveThreadId(newThreadId)
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI assistant. I can help you create documents, presentations, analyze data, and more. What would you like to work on today?",
        timestamp: new Date(),
        suggestions: ["Create a document", "Generate a presentation", "Analyze data"]
      }
    ])
  }

  const switchThread = (threadId: string) => {
    setThreads((prev: Thread[]) => prev.map((t: Thread) => ({ ...t, active: t.id === threadId })))
    setActiveThreadId(threadId)
    // In a real app, you'd load the thread's messages here
  }

  const deleteThread = (threadId: string) => {
    const updatedThreads = threads.filter(t => t.id !== threadId)
    if (updatedThreads.length === 0) {
      createNewThread()
    } else {
      setThreads(updatedThreads)
      if (activeThreadId === threadId) {
        setActiveThreadId(updatedThreads[0].id)
      }
    }
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      "bg-white",
      "border-r border-gray-200"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewThread}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Threads Dropdown */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setThreadsDropdownOpen(!threadsDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">
                {threads.find(t => t.id === activeThreadId)?.title || "Select Thread"}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              threadsDropdownOpen && "rotate-180"
            )} />
          </Button>
          
          {threadsDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50",
                    thread.active && "bg-blue-50"
                  )}
                  onClick={() => {
                    switchThread(thread.id)
                    setThreadsDropdownOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{thread.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteThread(thread.id)
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  message.role === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-900"
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion, message.action)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
