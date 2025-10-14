
// pages/PromotionsPage/components/MenuItemCard.tsx

import React from "react";
import { CheckCircle } from "lucide-react";
import type { MenuItemCardProps } from "../types";

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  isSelected,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="p-4 cursor-pointer transition-colors border-l-4"
      style={{
        backgroundColor: isSelected ? "var(--primary-container)" : undefined,
        borderLeftColor: isSelected ? "var(--primary)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "var(--surface-container)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold" style={{ color: "var(--on-surface)" }}>
            {item.name}
          </h4>
          <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
            Category: {item.category}
          </p>
          <p className="text-lg font-bold mt-2" style={{ color: "var(--success)" }}>
            €{item.price.toFixed(2)}
          </p>
        </div>
        {isSelected && (
          <CheckCircle className="h-5 w-5 mt-1" style={{ color: "var(--primary)" }} />
        )}
      </div>
    </div>
  );
};