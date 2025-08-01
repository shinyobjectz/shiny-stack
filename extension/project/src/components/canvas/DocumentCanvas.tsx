import { useState, useEffect, useRef } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import { stylesConfig } from "../../lib/config"
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Paragraph from "@editorjs/paragraph"

export function DocumentCanvas() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editor, setEditor] = useState<EditorJS | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  
  const createDocument = useMutation(api.mutations.documents.create)

  useEffect(() => {
    if (editorRef.current && !editor) {
      const editorInstance = new EditorJS({
        holder: editorRef.current,
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
        },
        placeholder: 'Start writing your document...',
      })
      setEditor(editorInstance)
    }
  }, [])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (editor) {
      try {
        const outputData = await editor.save()
        await createDocument({
          title,
          content: JSON.stringify(outputData),
          type: "document",
        })
        toast.success("Document saved!")
        setTitle("")
      } catch (error) {
        toast.error("Failed to save document")
      }
    }
  }

  return (
    <div className="h-full flex flex-col p-8">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title..."
              className={cn(
                "text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent",
                "placeholder:text-stone-400"
              )}
            />
          </div>
          <Button
            onClick={() => void handleSave()}
            disabled={!title.trim()}
            className={cn("rounded-2xl")}
            style={{ borderRadius: `${stylesConfig.components.button_radius}px` }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-1 mb-8">
          <div 
            ref={editorRef}
            className={cn(
              "h-full min-h-[400px] text-base leading-relaxed"
            )}
            style={{ 
              fontFamily: stylesConfig.typography.font_family,
              fontSize: `${stylesConfig.typography.font_size}px`,
              lineHeight: stylesConfig.typography.line_height
            }}
          />
        </div>


      </div>
    </div>
  )
}
