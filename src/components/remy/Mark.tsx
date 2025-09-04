import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Temporary placeholder until real AI chatbot is integrated
const Mark: React.FC = () => {
  const [question, setQuestion] = React.useState("");
  const [tip, setTip] = React.useState("");
  const sampleTips = [
    "Capture chefs in action for behind-the-scenes charm.",
    "Use natural light to highlight your signature dishes.",
    "Feature happy guests enjoying their meals to build trust.",
  ];
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Mark</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          placeholder="Ask for photo ideas..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          onClick={() => setTip(sampleTips[Math.floor(Math.random() * sampleTips.length)])}
        >
          Get Photo Tip
        </Button>
        {tip && <p className="text-sm text-muted-foreground">{tip}</p>}
        {/* TODO: replace with real chatbot endpoint */}
      </CardContent>
    </Card>
  );
};

export default Mark;
