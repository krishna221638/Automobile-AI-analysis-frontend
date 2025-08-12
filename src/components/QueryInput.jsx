import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';

const QueryInput = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery(''); // Clear input after submission
    }
  };

  const exampleQueries = [
    "Show average price by brand",
    "Display fuel efficiency vs price scatter plot",
    "Compare engine sizes across car types",
    "Show price distribution histogram"
  ];

  const handleExampleClick = (example) => {
    setQuery(example);
  };

  return (
    <Card className="p-6 bg-gradient-card border-glass backdrop-blur-glass">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Ask me about your automobile data</h2>
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show average price by brand..."
            className="flex-1 bg-input/50 border-glass focus:border-primary transition-smooth"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Example queries */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 text-xs rounded-full bg-secondary hover:bg-secondary/80 
                         transition-smooth border border-glass"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default QueryInput;