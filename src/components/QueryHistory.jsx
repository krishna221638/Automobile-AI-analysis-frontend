import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const QueryHistory = ({ history, onRerunQuery, onClearHistory }) => {
  if (!history || history.length === 0) {
    return (
      <Card className="bg-gradient-card border-glass backdrop-blur-glass">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <History className="h-5 w-5 mr-2 text-primary" />
            Query History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No queries yet</p>
            <p className="text-xs mt-1">Your query history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-glass backdrop-blur-glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <History className="h-5 w-5 mr-2 text-primary" />
          Query History ({history.length})
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearHistory}
          className="border-glass hover:bg-destructive/20 hover:border-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {history.slice().reverse().map((item, index) => (
              <div 
                key={item.id || index}
                className="p-3 rounded-lg bg-secondary/30 border border-glass hover:bg-secondary/50 
                         transition-smooth group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate mb-1">
                      {item.query}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>
                        {item.config?.chart} chart
                      </span>
                      <span>
                        {item.config?.x} × {item.config?.y}
                      </span>
                      <span>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRerunQuery(item.query)}
                    className="opacity-0 group-hover:opacity-100 transition-smooth ml-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {item.error && (
                  <div className="mt-2 p-2 bg-destructive/20 border border-destructive/30 rounded text-xs">
                    Error: {item.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QueryHistory;