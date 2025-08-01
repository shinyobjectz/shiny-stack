import { Video } from "lucide-react"
import { cn } from "../../lib/utils"
import { stylesConfig } from "../../lib/config"

export function VideoCanvas() {
  return (
    <div className="h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className={cn("text-3xl font-bold mb-2", stylesConfig.text.primary)}>Video Studio</h2>
          <p className={cn("text-lg", stylesConfig.text.secondary)}>Create AI-powered video content</p>
        </div>

        <div className={cn(
          "rounded-2xl p-8 text-center border",
          stylesConfig.chat.panel.background,
          stylesConfig.borders.default
        )}>
          <Video className={cn("h-16 w-16 mx-auto mb-4", stylesConfig.text.secondary, "opacity-50")} />
          <h3 className={cn("text-xl font-semibold mb-4", stylesConfig.text.primary)}>Video Feature Coming Soon</h3>
          <p className={cn("mb-6 max-w-md mx-auto", stylesConfig.text.secondary)}>
            We're working on integrating Remotion for programmatic video generation.
            This will allow you to create videos from templates, data, and AI-generated content.
          </p>
          
          <div className={cn(
            "rounded-2xl p-6 text-left max-w-md mx-auto",
            stylesConfig.chat.input.background
          )}>
            <h4 className={cn("font-semibold mb-3", stylesConfig.text.primary)}>Planned Features:</h4>
            <ul className={cn("space-y-2 text-sm", stylesConfig.text.secondary)}>
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
