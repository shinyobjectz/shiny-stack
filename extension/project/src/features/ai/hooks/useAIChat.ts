// AI Chat Hook for ShinyStack
// This hook provides AI chat functionality with message management

import { useState, useRef, useEffect } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: string;
  suggestions?: string[];
}

export interface Thread {
  id: string;
  title: string;
  active: boolean;
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you create documents, presentations, analyze data, and more. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: ['Create a document', 'Generate a presentation', 'Analyze data']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([
    { id: '1', title: 'New Chat', active: true }
  ]);
  const [activeThreadId, setActiveThreadId] = useState('1');

  const chatAgent = useAction(api.actions.agent.chatAgent);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAgent({ message: message.trim() });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.result,
        timestamp: new Date(),
        action: response.action,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewThread = () => {
    const newThreadId = (Date.now() + 1).toString();
    const newThread: Thread = {
      id: newThreadId,
      title: 'New Chat',
      active: true
    };

    setThreads(prev => prev.map(t => ({ ...t, active: false })).concat(newThread));
    setActiveThreadId(newThreadId);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. I can help you create documents, presentations, analyze data, and more. What would you like to work on today?",
        timestamp: new Date(),
        suggestions: ['Create a document', 'Generate a presentation', 'Analyze data']
      }
    ]);
  };

  const switchThread = (threadId: string) => {
    setThreads(prev => prev.map(t => ({ ...t, active: t.id === threadId })));
    setActiveThreadId(threadId);
    // In a real app, you'd load the thread's messages here
  };

  const deleteThread = (threadId: string) => {
    const updatedThreads = threads.filter(t => t.id !== threadId);
    if (updatedThreads.length === 0) {
      createNewThread();
    } else {
      setThreads(updatedThreads);
      if (activeThreadId === threadId) {
        setActiveThreadId(updatedThreads[0].id);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string, action?: string, onViewChange?: (view: string) => void) => {
    if (suggestion.includes('document') || action === 'document_creation') {
      onViewChange?.('documents');
    } else if (suggestion.includes('presentation') || action === 'presentation_creation') {
      onViewChange?.('presentations');
    } else if (suggestion.includes('data') || action === 'data_query') {
      onViewChange?.('data');
    } else if (suggestion.includes('video') || action === 'video_creation') {
      onViewChange?.('video');
    }
  };

  return {
    // State
    messages,
    input,
    setInput,
    isLoading,
    threads,
    activeThreadId,
    scrollAreaRef,

    // Actions
    sendMessage,
    createNewThread,
    switchThread,
    deleteThread,
    handleSuggestionClick,

    // Computed
    currentThread: threads.find(t => t.id === activeThreadId),
  };
} 