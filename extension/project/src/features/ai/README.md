# AI Feature - ShinyStack AI Integration

This feature provides comprehensive AI functionality for the ShinyStack application, including chat, model management, and prompt editing.

## 🚀 Features

### **AI Chat System**
- **Real-time chat** with AI assistants
- **Thread management** for organizing conversations
- **Message history** with timestamps
- **Suggestion handling** for quick actions
- **Auto-scroll** and responsive design

### **AI Model Management**
- **Multiple model support** (GPT-4, GPT-3.5, Claude, etc.)
- **Model selection** with cost and capability comparison
- **Fallback handling** for reliability
- **Configuration integration** with ShinyStack config system

### **Prompt Management**
- **Prompt editor** for creating and editing AI prompts
- **Template system** with predefined prompts
- **Category organization** and tagging
- **Copy/paste functionality** for easy sharing

## 📁 Structure

```
ai/
├── components/
│   ├── ChatCanvas.tsx        # Main chat interface
│   ├── ChatPanel.tsx         # Chat sidebar with threads
│   ├── AIModelSelector.tsx   # Model selection component
│   └── AIPromptEditor.tsx    # Prompt creation/editing
├── hooks/
│   ├── useAIChat.ts          # Chat functionality hook
│   └── useAIModel.ts         # Model management hook
├── page.tsx                  # AI feature page
└── README.md                # This file
```

## 🔧 Components

### ChatCanvas
Main chat interface that displays messages and handles user input.

**Features:**
- Message display with user/assistant distinction
- Real-time typing and sending
- Suggestion handling
- Auto-scroll to latest messages

### ChatPanel
Sidebar component for managing chat threads and navigation.

**Features:**
- Thread creation and management
- Active thread switching
- Thread deletion
- Canvas type switching

### AIModelSelector
Component for selecting different AI models with detailed information.

**Features:**
- Model comparison (cost, capabilities)
- Provider information
- Token limits and pricing
- Easy model switching

### AIPromptEditor
Advanced prompt creation and management interface.

**Features:**
- Rich text editing
- Template loading
- Category and tag organization
- Copy/paste functionality

## 🎣 Hooks

### useAIChat
Provides complete chat functionality:

```typescript
const {
  messages,
  input,
  setInput,
  isLoading,
  threads,
  activeThreadId,
  sendMessage,
  createNewThread,
  switchThread,
  deleteThread,
  handleSuggestionClick
} = useAIChat();
```

### useAIModel
Manages AI model selection and configuration:

```typescript
const {
  selectedModel,
  setSelectedModel,
  availableModels,
  currentModel,
  switchToFallback,
  getModelConfig,
  estimateCost
} = useAIModel();
```

## 🔄 Integration

### With ShinyStack Config System
- **AI configuration** from `ai.config`
- **Model settings** from config files
- **Prompt templates** from configuration
- **Dynamic updates** when config changes

### With Convex Backend
- **Chat agent actions** for AI responses
- **User authentication** integration
- **Message persistence** (when implemented)
- **Thread management** (when implemented)

### With Auth System
- **User-specific** chat history
- **Authentication** required for AI features
- **User preferences** for model selection

## 🎨 Styling

All components use the ShinyStack design system:
- **Consistent theming** with the rest of the app
- **Dark mode support**
- **Responsive design** for all screen sizes
- **Loading states** and animations
- **Accessibility** features

## 🔒 Security

- **Input validation** for all user inputs
- **Rate limiting** through Convex actions
- **Error handling** with user-friendly messages
- **Secure API calls** with proper authentication

## 📊 Usage Examples

### Basic Chat Usage
```typescript
import { useAIChat } from '../hooks/useAIChat';

function MyChatComponent() {
  const { messages, sendMessage, isLoading } = useAIChat();
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.content}</div>
      ))}
      <button onClick={() => sendMessage("Hello AI!")}>
        Send Message
      </button>
    </div>
  );
}
```

### Model Selection
```typescript
import { AIModelSelector } from '../components/AIModelSelector';

function MyModelSelector() {
  return (
    <AIModelSelector 
      onModelChange={(modelId) => console.log('Selected:', modelId)}
    />
  );
}
```

### Prompt Editing
```typescript
import { AIPromptEditor } from '../components/AIPromptEditor';

function MyPromptEditor() {
  return (
    <AIPromptEditor 
      onSave={(prompt) => console.log('Saved:', prompt)}
      onUse={(prompt) => console.log('Using:', prompt)}
    />
  );
}
```

## 🚀 Future Enhancements

- **Message persistence** in database
- **Advanced thread management**
- **Prompt library** with sharing
- **Cost tracking** and usage analytics
- **Multi-modal** AI support (images, files)
- **Custom model** integration
- **Prompt optimization** suggestions 