import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronDown, FileText, Presentation, Database, Video } from "lucide-react"
import { DocumentCanvas } from "./canvas/DocumentCanvas"
import { PresentationCanvas } from "./canvas/PresentationCanvas"
import { DataCanvas } from "./canvas/DataCanvas"
import { VideoCanvas } from "./canvas/VideoCanvas"
import { cn } from "../lib/utils"

interface CanvasProps {
  type: string
  onTypeChange: (type: string) => void
}

const iconMap = {
  FileText,
  Presentation,
  Database,
  Video,
}

// Default canvas types since we're not using the config system yet
const defaultCanvasTypes = [
  { id: "chat", label: "Chat", icon: "FileText" },
  { id: "document", label: "Document", icon: "FileText" },
  { id: "presentation", label: "Presentation", icon: "Presentation" },
  { id: "data", label: "Data", icon: "Database" },
  { id: "video", label: "Video", icon: "Video" }
]

export function Canvas({ type, onTypeChange }: CanvasProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const currentType = defaultCanvasTypes.find(t => t.id === type) || defaultCanvasTypes[0]
  const CurrentIcon = iconMap[currentType.icon as keyof typeof iconMap]

  const renderCanvas = () => {
    switch (type) {
      case "chat":
        return <div className="flex-1 flex items-center justify-center text-gray-500">Chat Canvas</div>
      case "document":
        return <DocumentCanvas />
      case "presentation":
        return <PresentationCanvas />
      case "data":
        return <DataCanvas />
      case "video":
        return <VideoCanvas />
      default:
        return <DocumentCanvas />
    }
  }

  return (
    <div className={cn("h-full flex flex-col bg-white")}>
      {/* Floating Canvas Type Selector */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              "rounded-2xl",
              "bg-white/80",
              "border-gray-200",
              "backdrop-blur-sm"
            )}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center gap-2">
              <CurrentIcon className="h-4 w-4" />
              <span className="text-gray-900">{currentType.label}</span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 ml-2 transition-transform",
              "text-gray-500",
              dropdownOpen && "rotate-180"
            )} />
          </Button>
          
          {dropdownOpen && (
            <div className={cn(
              "absolute top-full right-0 mt-2 rounded-2xl p-2 min-w-[200px]",
              "bg-white/80",
              "border-gray-200",
              "backdrop-blur-sm shadow-lg"
            )}>
              {defaultCanvasTypes.map((canvasType) => {
                const Icon = iconMap[canvasType.icon as keyof typeof iconMap]
                return (
                  <Button
                    key={canvasType.id}
                    variant={type === canvasType.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 rounded-xl",
                      type === canvasType.id 
                        ? "bg-blue-50 text-blue-700" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => {
                      onTypeChange(canvasType.id)
                      setDropdownOpen(false)
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-gray-900">{canvasType.label}</span>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-hidden">
        {renderCanvas()}
      </div>
    </div>
  )
}
