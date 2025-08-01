import { useState } from "react"
import { Toaster } from "sonner"
import { ChatPanel } from "./features/ai/components/ChatPanel"
import { Canvas } from "./components/Canvas"
import { AuthProvider } from "./features/auth/AuthProvider"
import { AuthGuard } from "./features/auth/components/AuthGuard"
import { UserProfile } from "./features/auth/UserProfile"
import { cn } from "./lib/utils"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone-950">
        <AuthGuard>
          <MainContent />
        </AuthGuard>
        <Toaster theme="dark" />
      </div>
    </AuthProvider>
  )
}

function MainContent() {
  const [activeCanvasType, setActiveCanvasType] = useState("chat")
  const [threads, setThreads] = useState([
    { id: "1", title: "New Chat", active: true }
  ])
  const [activeThreadId, setActiveThreadId] = useState("1")

  return (
    <div className={cn(
      "flex h-screen",
      "p-4",
      "gap-4",
      "bg-stone-950"
    )}>
      {/* Chat Panel */}
      <div className="w-80 flex-shrink-0">
        <ChatPanel 
          threads={threads}
          setThreads={setThreads}
          activeThreadId={activeThreadId}
          setActiveThreadId={setActiveThreadId}
          onCanvasTypeChange={setActiveCanvasType}
        />
      </div>
      
      {/* Canvas */}
      <div className="flex-1">
        <Canvas 
          type={activeCanvasType}
          onTypeChange={setActiveCanvasType}
        />
      </div>
      
      {/* User Profile Sidebar */}
      <div className="w-64 flex-shrink-0">
        <UserProfile />
      </div>
    </div>
  )
}
