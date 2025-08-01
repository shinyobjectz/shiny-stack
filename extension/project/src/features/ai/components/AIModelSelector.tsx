// AI Model Selector Component for ShinyStack
// This component allows users to select different AI models

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ChevronDown, Zap, DollarSign, Clock } from 'lucide-react';
import { useAIModel, type AIModel } from '../hooks/useAIModel';
import { cn } from '../../../lib/utils';

interface AIModelSelectorProps {
  className?: string;
  onModelChange?: (modelId: string) => void;
}

export function AIModelSelector({ className, onModelChange }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    selectedModel, 
    setSelectedModel, 
    availableModels, 
    currentModel,
    estimateCost 
  } = useAIModel();

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange?.(modelId);
    setIsOpen(false);
  };

  const formatCost = (cost: number) => {
    if (cost < 0.001) {
      return `$${(cost * 1000).toFixed(2)}/1K tokens`;
    }
    return `$${cost.toFixed(4)}/token`;
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span>{currentModel?.name || 'Select Model'}</span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Select AI Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {availableModels.map((model) => (
                <ModelOption
                  key={model.id}
                  model={model}
                  isSelected={model.id === selectedModel}
                  onSelect={handleModelSelect}
                  formatCost={formatCost}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface ModelOptionProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
  formatCost: (cost: number) => string;
}

function ModelOption({ model, isSelected, onSelect, formatCost }: ModelOptionProps) {
  return (
    <Button
      variant={isSelected ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-3 p-3 h-auto',
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
      )}
      onClick={() => onSelect(model.id)}
    >
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-sm text-gray-500">{model.provider}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{formatCost(model.costPerToken)}</div>
            <div className="text-xs text-gray-500">
              {model.maxTokens.toLocaleString()} tokens
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Temp: {model.temperature}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>Cost: {formatCost(model.costPerToken)}</span>
          </div>
        </div>
      </div>
    </Button>
  );
} 