import { Video } from "lucide-react"

export function VideoView() {
  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Video Studio</h1>
          <p className="text-muted-foreground">Create AI-powered video content</p>
        </div>

        <div className="bg-card rounded-lg border p-8 text-center">
          <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-4">Video Feature Coming Soon</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're working on integrating Remotion for programmatic video generation.
            This will allow you to create videos from templates, data, and AI-generated content.
          </p>
          
          <div className="bg-muted rounded-lg p-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold mb-3">Planned Features:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• AI-generated video scripts</li>
              <li>• Template-based video creation</li>
              <li>• Data visualization videos</li>
              <li>• Automated voice narration</li>
              <li>• Custom branding and themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
