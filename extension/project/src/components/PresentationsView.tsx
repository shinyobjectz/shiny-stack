import { useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Presentation, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function PresentationsView() {
  const [topic, setTopic] = useState("")
  const [slides, setSlides] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const presentations = useQuery(api.queries.documents.list)?.filter(
    doc => doc.type === "presentation"
  ) || []
  const generatePresentation = useAction(api.actions.generate.presentation)
  const createDocument = useMutation(api.mutations.documents.create)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a presentation topic")
      return
    }

    setIsGenerating(true)
    try {
      const result = await generatePresentation({ topic, slides })
      
      await createDocument({
        title: `Presentation: ${topic}`,
        content: result.result,
        type: "presentation",
      })
      
      toast.success("Presentation generated!")
      setTopic("")
    } catch (error) {
      toast.error("Failed to generate presentation")
    } finally {
      setIsGenerating(false)
    }
  }

  const parseSlides = (content: string) => {
    try {
      const parsed = JSON.parse(content)
      return parsed.slides || []
    } catch {
      return []
    }
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Presentations</h1>
          <p className="text-muted-foreground">Create AI-powered slide presentations</p>
        </div>

        {/* Generation Form */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate New Presentation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Topic
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning Basics"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Slides
              </label>
              <select
                value={slides}
                onChange={(e) => setSlides(Number(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                {[3, 5, 7, 10, 15].map(num => (
                  <option key={num} value={num}>{num} slides</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() => void handleGenerate()}
            disabled={isGenerating || !topic.trim()}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Generate Presentation
              </>
            )}
          </Button>
        </div>

        {/* Presentations List */}
        <div className="bg-card rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Presentations</h2>
          </div>
          
          {presentations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Presentation className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No presentations yet</p>
              <p className="text-sm">Generate your first one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {presentations.map((presentation) => {
                const slides = parseSlides(presentation.content)
                return (
                  <div key={presentation._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <h3 className="font-semibold truncate">{presentation.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {slides.length} slides • {new Date(presentation._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {slides.length > 0 && (
                      <div className="bg-muted rounded p-3 mb-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">First Slide:</div>
                        <div className="text-sm font-medium">{slides[0]?.title}</div>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      View Presentation
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
