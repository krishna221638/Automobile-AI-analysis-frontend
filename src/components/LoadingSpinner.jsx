import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brain, Database } from 'lucide-react';

const LoadingSpinner = ({ stage = 'analyzing' }) => {
  const stages = {
    analyzing: {
      icon: Brain,
      title: 'Analyzing Query',
      description: 'Mistral AI is understanding your request...',
      color: 'text-primary'
    },
    fetching: {
      icon: Database,
      title: 'Fetching Data',
      description: 'Retrieving automobile data...',
      color: 'text-accent'
    },
    rendering: {
      icon: Loader2,
      title: 'Creating Chart',
      description: 'Generating your visualization...',
      color: 'text-chart-3'
    }
  };

  const currentStage = stages[stage] || stages.analyzing;
  const Icon = currentStage.icon;

  return (
    <Card className="bg-gradient-card border-glass backdrop-blur-glass">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="relative mb-6">
          {/* Animated background circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-pulse" />
          
          {/* Main icon */}
          <div className={`relative z-10 p-4 rounded-full bg-card border border-glass ${currentStage.color}`}>
            <Icon className={`h-8 w-8 ${stage === 'rendering' ? 'animate-spin' : 'animate-pulse'}`} />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">{currentStage.title}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {currentStage.description}
        </p>

        {/* Progress dots */}
        <div className="flex space-x-2 mt-6">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                ['analyzing', 'fetching', 'rendering'].indexOf(stage) >= dot
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
              style={{
                animationDelay: `${dot * 0.2}s`,
                animation: ['analyzing', 'fetching', 'rendering'].indexOf(stage) >= dot
                  ? 'pulse 1.5s infinite'
                  : 'none'
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSpinner;