import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { FileText, Plus, Save, Edit3 } from "lucide-react"
import { toast } from "sonner"

export function DocumentsView() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  
  const documents = useQuery(api.queries.documents.list) || []
  const createDocument = useMutation(api.mutations.documents.create)
  const updateDocument = useMutation(api.mutations.documents.update)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter both title and content")
      return
    }

    try {
      if (selectedDoc) {
        await updateDocument({
          id: selectedDoc as any,
          title,
          content,
        })
        toast.success("Document updated!")
      } else {
        await createDocument({
          title,
          content,
          type: "document",
        })
        toast.success("Document created!")
        setTitle("")
        setContent("")
      }
    } catch (error) {
      toast.error("Failed to save document")
    }
  }

  const handleLoadDocument = (doc: any) => {
    setSelectedDoc(doc._id)
    setTitle(doc.title)
    setContent(doc.content)
  }

  const handleNewDocument = () => {
    setSelectedDoc(null)
    setTitle("")
    setContent("")
  }

  return (
    <div className="flex h-full">
      {/* Document List */}
      <div className="w-80 border-r bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Documents</h2>
          <Button
            onClick={handleNewDocument}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-73px)]">
          <div className="p-2 space-y-2">
            {documents.map((doc) => (
              <Button
                key={doc._id}
                variant={selectedDoc === doc._id ? "secondary" : "ghost"}
                className="w-full justify-start p-3 h-auto"
                onClick={() => handleLoadDocument(doc)}
              >
                <div className="flex items-start gap-3 w-full">
                  <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents yet</p>
                <p className="text-sm">Create your first document!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title..."
                className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {selectedDoc ? "Update" : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your document..."
            className="h-full resize-none border-none shadow-none focus-visible:ring-0 text-base"
          />
        </div>

        {/* Document Stats */}
        {content && (
          <div className="border-t p-4">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Words: {content.split(/\s+/).filter(w => w).length}</span>
              <span>Characters: {content.length}</span>
              <span>Lines: {content.split('\n').length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
