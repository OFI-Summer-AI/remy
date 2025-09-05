import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Mark: React.FC = () => {
  const [question, setQuestion] = React.useState("");
  const [tip, setTip] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const getPhotoTip = React.useCallback(async () => {
    if (!question.trim()) {
      setTip("Please ask a specific question about photography or food styling!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const LLM_WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/bdde9056-c5b1-481d-a68c-21a755883e05";
      const response = await fetch(`${LLM_WEBHOOK_URL}?message=${encodeURIComponent(question)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTip(data.output || "Sorry, I couldn't generate a tip right now.");
    } catch (error) {
      console.error("Error getting photo tip:", error);
      setTip("Sorry, I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [question]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Mark - Photography Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          placeholder="Ask for photo ideas... (e.g., 'How should I photograph pasta dishes?' or 'What angles work best for desserts?')"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          onClick={getPhotoTip}
          disabled={isLoading}
        >
          {isLoading ? "Getting Tip..." : "Get Photo Tip"}
        </Button>
        {tip && (
          <div className="p-3 bg-muted/20 rounded-md">
            <p className="text-sm">{tip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Mark;
