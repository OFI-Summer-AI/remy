
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

const placeholderMessages = [
  { id: 1, role: "assistant", text: "Try a midweek combo: soup + salad -15%." },
  { id: 2, role: "user", text: "Any pizza of the month ideas?" },
  { id: 3, role: "assistant", text: "Truffle mushroom pizza with seasonal herbs." },
];

const PromotionsPage: React.FC = () => {
  const [chatInput, setChatInput] = React.useState("");

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
              {placeholderMessages.map((m) => (
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
            </div>

            {/* Suggested + input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Suggested:</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setChatInput("Create pizza of the month based on trends")
                  }
                >
                  Create pizza of the month based on trends
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question..."
                  aria-label="Promo chatbot input"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setChatInput("")}
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
