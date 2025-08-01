import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { 
  MessageSquare, 
  FileText, 
  Presentation, 
  Database, 
  Video, 
  Settings,
  Plus,
  Bot,
  User
} from "lucide-react"
import { cn } from "../lib/utils"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const user = useQuery(api.auth.loggedInUser)
  const documents = useQuery(api.queries.documents.list) || []
  
  const navigationItems = [
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "presentations", label: "Presentations", icon: Presentation },
    { id: "data", label: "Data Analysis", icon: Database },
    { id: "video", label: "Video Studio", icon: Video },
  ]

  const recentDocuments = documents.slice(0, 5)

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* User Profile */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.image} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-muted-foreground">AI Product Studio</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    activeView === item.id && "bg-secondary"
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Recent Documents */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Recent
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onViewChange("documents")}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {recentDocuments.length === 0 ? (
                <p className="px-2 text-xs text-muted-foreground">
                  No recent documents
                </p>
              ) : (
                <div className="space-y-1">
                  {recentDocuments.map((doc) => (
                    <Button
                      key={doc._id}
                      variant="ghost"
                      className="w-full justify-start gap-2 h-8 px-2"
                      onClick={() => onViewChange("documents")}
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate text-xs">{doc.title}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Settings */}
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => onViewChange("settings")}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
