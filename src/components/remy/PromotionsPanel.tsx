import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const items = [{
  id: 1,
  name: "Pumpkin Soup",
  currentPrice: 6.5
}, {
  id: 2,
  name: "Quinoa Salad",
  currentPrice: 9.0
}, {
  id: 3,
  name: "Veggie Lasagna",
  currentPrice: 11.5
}];

const PromotionsPanel: React.FC = () => {
  const [chatInput, setChatInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  const placeholderMessages = [{
    id: 1,
    role: "assistant",
    text: "Try a midweek combo: soup + salad -15%."
  }, {
    id: 2,
    role: "user",
    text: "Any pizza of the month ideas?"
  }, {
    id: 3,
    role: "assistant",
    text: "Truffle mushroom pizza with seasonal herbs."
  }];

  const [messages, setMessages] = React.useState(placeholderMessages);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: "user" as const,
      text: chatInput
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const LLM_WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/bdde9056-c5b1-481d-a68c-21a755883e05";
      const response = await fetch(`${LLM_WEBHOOK_URL}?message=${encodeURIComponent(chatInput)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant" as const,
        text: data.output || "Sorry, I couldn't generate a suggestion right now."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting promotion suggestion:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant" as const,
        text: "Sorry, I'm having trouble connecting right now. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setChatInput("");
    }
  };

  return (
    <section aria-label="Promotions" className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(it => 
              <div key={it.id} className="rounded-lg border border-border p-4 bg-card text-card-foreground space-y-3">
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">Current: €{it.currentPrice.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`discount-${it.id}`}>Discount %</Label>
                  <Input id={`discount-${it.id}`} type="number" min={0} max={100} placeholder="e.g. 15" aria-label={`Discount percent for ${it.name}`} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`schedule-${it.id}`}>Schedule promo</Label>
                  <Input id={`schedule-${it.id}`} type="date" aria-label={`Schedule date for ${it.name}`} />
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 rounded-lg border border-border p-4 bg-card text-card-foreground">
            <h3 className="text-base font-semibold">Ask for promo ideas</h3>
            
            <div className="mt-3 h-48 overflow-y-auto space-y-2 rounded-md bg-muted/40 p-3">
              {messages.map(m => 
                <div key={m.id} className={m.role === "user" ? "ml-auto max-w-[75%] rounded-md bg-primary/10 p-2 text-sm" : "max-w-[75%] rounded-md bg-accent/10 p-2 text-sm"}>
                  {m.text}
                </div>
              )}
              {isLoading && (
                <div className="max-w-[75%] rounded-md bg-accent/10 p-2 text-sm">
                  Thinking...
                </div>
              )}
            </div>
            <div className="mt-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Suggested:</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setChatInput("Create pizza of the month based on trends")} className="bg-sky-400 hover:bg-sky-300 text-slate-50">
                  Create pizza of the month based on trends
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  placeholder="Type your question..." 
                  aria-label="Promo chatbot input"
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={sendMessage}
                  disabled={isLoading || !chatInput.trim()}
                  className="bg-sky-400 hover:bg-sky-300"
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PromotionsPanel;
