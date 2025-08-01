// AI Prompt Editor Component for ShinyStack
// This component allows users to create and edit AI prompts

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Save, Plus, Trash2, Copy, Sparkles } from 'lucide-react';
import { useShinyValue } from '../../../lib/shiny';

export interface AIPrompt {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIPromptEditorProps {
  prompt?: AIPrompt;
  onSave?: (prompt: AIPrompt) => void;
  onDelete?: (promptId: string) => void;
  onUse?: (prompt: AIPrompt) => void;
  className?: string;
}

export function AIPromptEditor({ 
  prompt, 
  onSave, 
  onDelete, 
  onUse,
  className 
}: AIPromptEditorProps) {
  const [name, setName] = useState(prompt?.name || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState(prompt?.category || '');
  const [tags, setTags] = useState(prompt?.tags?.join(', ') || '');
  const [isEditing, setIsEditing] = useState(!prompt);

  // Get prompt templates from config
  const promptTemplates = useShinyValue('ai.prompts');

  const handleSave = () => {
    if (!name.trim() || !content.trim()) return;

    const newPrompt: AIPrompt = {
      id: prompt?.id || Date.now().toString(),
      name: name.trim(),
      content: content.trim(),
      category: category.trim(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: prompt?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave?.(newPrompt);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (prompt) {
      onDelete?.(prompt.id);
    }
  };

  const handleUse = () => {
    if (prompt) {
      onUse?.(prompt);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const loadTemplate = (templateName: string) => {
    const template = promptTemplates?.[templateName];
    if (template) {
      setContent(template);
    }
  };

  const suggestedTemplates = [
    'system_prompt',
    'user_prompt_template',
    'error_prompt'
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {isEditing ? 'Edit Prompt' : 'Prompt Editor'}
          </CardTitle>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {onUse && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUse}
                  >
                    Use
                  </Button>
                )}
              </>
            )}
            {onDelete && prompt && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter prompt name..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Writing, Analysis, Code..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., writing, creative, professional..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your prompt content..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Template Suggestions */}
            {suggestedTemplates.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Load Template</label>
                <div className="flex gap-2 flex-wrap">
                  {suggestedTemplates.map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      onClick={() => loadTemplate(template)}
                    >
                      {template.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!name.trim() || !content.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              {prompt && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{prompt?.name}</h3>
              {prompt?.category && (
                <p className="text-sm text-gray-500">{prompt.category}</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {prompt?.content}
              </pre>
            </div>

            {prompt?.tags && prompt.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 