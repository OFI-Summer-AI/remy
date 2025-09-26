import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

const items = [
  { id: 1, name: "Pumpkin Soup", currentPrice: 6.5 },
  { id: 2, name: "Quinoa Salad", currentPrice: 9.0 },
  { id: 3, name: "Veggie Lasagna", currentPrice: 11.5 },
];

const WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/bdde9056-c5b1-481d-a68c-21a755883e05";

const PromotionsPage = () => {
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    { id: 1, role: "assistant", text: "Try a midweek combo: soup + salad -15%." },
    { id: 2, role: "user", text: "Any pizza of the month ideas?" },
    { id: 3, role: "assistant", text: "Truffle mushroom pizza with seasonal herbs." },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: chatInput
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          timestamp: new Date().toISOString(),
          context: "promotions_chat"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Debug: Log the actual response structure
      console.log('Webhook response:', data);
      
      // Add assistant response to chat
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.response || data.message || data.output || data.result || JSON.stringify(data) || "I received your message and I'm working on a response!"
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I'm having trouble connecting right now. Please try again later."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setChatInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section aria-label="Promotions" className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Menu items with discount/schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="rounded-lg border border-border p-4 bg-card text-card-foreground space-y-3 shadow-sm"
              >
                <div>
                  <p className="font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Current: €{it.currentPrice.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`discount-${it.id}`}>Discount %</Label>
                  <Input
                    id={`discount-${it.id}`}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 15"
                    aria-label={`Discount percent for ${it.name}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`schedule-${it.id}`}>Schedule promo</Label>
                  <Input
                    id={`schedule-${it.id}`}
                    type="date"
                    aria-label={`Schedule date for ${it.name}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Chatbot / assistant ideas */}
          <div className="rounded-lg border border-border p-4 bg-card text-card-foreground space-y-4">
            <h3 className="text-base font-semibold">Ask for promo ideas</h3>

            {/* Messages */}
            <div className="h-48 overflow-y-auto space-y-2 rounded-md bg-muted/40 p-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[75%] p-2 text-sm rounded-md ${
                    m.role === "user"
                      ? "ml-auto bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted text-muted-foreground p-2 text-sm rounded-md max-w-[75%]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested + input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Suggested:</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setChatInput("Create pizza of the month based on trends")
                  }
                  disabled={isLoading}
                >
                  Pizza of the month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setChatInput("What seasonal promotions work best?")
                  }
                  disabled={isLoading}
                >
                  Seasonal promos
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  aria-label="Promo chatbot input"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={sendMessage}
                  disabled={isLoading || !chatInput.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PromotionsPage;
