import { useState } from "react"
import { useAction, useMutation, useQuery } from "convex/react"
import { api } from "@/convex"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Presentation, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import { stylesConfig } from "../../lib/config"

export function PresentationCanvas() {
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
    <div className="h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className={cn("text-3xl font-bold mb-2", stylesConfig.text.primary)}>Presentations</h2>
          <p className={cn("text-lg", stylesConfig.text.secondary)}>Create AI-powered slide presentations</p>
        </div>

        {/* Generation Form */}
        <div className="bg-stone-50/50 rounded-2xl p-8 mb-8 border border-stone-200/50">
          <h3 className="text-xl font-semibold mb-6">Generate New Presentation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Topic
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning Basics"
                className="rounded-2xl border-stone-300/50 focus:border-stone-400/50 focus:ring-stone-400/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">
                Number of Slides
              </label>
              <select
                value={slides}
                onChange={(e) => setSlides(Number(e.target.value))}
                className="w-full px-4 py-3 border border-stone-300/50 rounded-2xl bg-white focus:border-stone-400/50 focus:ring-stone-400/50"
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
            className="w-full rounded-2xl bg-stone-900 hover:bg-stone-800 py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Generate Presentation
              </>
            )}
          </Button>
        </div>

        {/* Presentations List */}
        <div className="bg-stone-50/50 rounded-2xl border border-stone-200/50">
          <div className="p-6 border-b border-stone-200/50">
            <h3 className="text-xl font-semibold">Your Presentations</h3>
          </div>
          
          {presentations.length === 0 ? (
            <div className="p-8 text-center text-stone-600">
              <Presentation className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No presentations yet</p>
              <p className="text-sm">Generate your first one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {presentations.map((presentation) => {
                const slides = parseSlides(presentation.content)
                return (
                  <div key={presentation._id} className="bg-white/50 rounded-2xl p-6 hover:bg-white/80 transition-colors border border-stone-200/30">
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg truncate">{presentation.title}</h4>
                      <p className="text-sm text-stone-600">
                        {slides.length} slides • {new Date(presentation._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {slides.length > 0 && (
                      <div className="bg-stone-100/50 rounded-xl p-4 mb-4">
                        <div className="text-xs font-medium text-stone-600 mb-1">First Slide:</div>
                        <div className="text-sm font-medium">{slides[0]?.title}</div>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full rounded-2xl border-stone-300/50 hover:bg-stone-50/50">
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
