
// pages/PromotionsPage/components/SelectedItemPreview.tsx

import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { SelectedItemPreviewProps } from "../types";

export const SelectedItemPreview: React.FC<SelectedItemPreviewProps> = ({
  item,
  discount
}) => {
  const finalPrice = discount ? item.price * (1 - parseInt(discount) / 100) : 0;

  return (
    <Card
      style={{
        backgroundColor: "var(--primary-container)",
        borderColor: "var(--primary)",
      }}
    >
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3" style={{ color: "var(--on-primary-container)" }}>
          Selected Item
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>
              Name:
            </span>
            <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
              {item.name}
            </p>
          </div>
          <div>
            <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>
              Category:
            </span>
            <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
              {item.category}
            </p>
          </div>
          <div>
            <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>
              Original Price:
            </span>
            <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
              €{item.price.toFixed(2)}
            </p>
          </div>
          {discount && (
            <div>
              <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>
                Final Price:
              </span>
              <p className="font-bold" style={{ color: "var(--success)" }}>
                €{finalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};