
// pages/PromotionsPage/components/PromotionRow.tsx

import React from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  Percent,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  Loader2
} from "lucide-react";
import { calculateStatus } from "../utils/utils";
import type { PromotionRowProps } from "../types";

export const PromotionRow: React.FC<PromotionRowProps> = ({
  promotion,
  onDelete,
  isDeleting
}) => {
  const discountNum = promotion.discount;
  const originalPrice = promotion.original_price || 0;
  const finalPrice = originalPrice * (1 - discountNum / 100);
  const savings = originalPrice - finalPrice;
  const status = calculateStatus(promotion.start_date, promotion.end_date);

  const statusConfig = {
    active: {
      color: 'var(--success)',
      icon: CheckCircle,
      label: 'Active',
      dotColor: 'var(--success)'
    },
    scheduled: {
      color: 'var(--secondary)',
      icon: Clock,
      label: 'Scheduled',
      dotColor: 'var(--secondary)'
    },
    expired: {
      color: 'var(--on-surface-variant)',
      icon: Calendar,
      label: 'Expired',
      dotColor: 'var(--outline)'
    }
  };

  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <TableRow
      className="transition-colors border-l-4"
      style={{
        borderLeftColor: status === 'active' ? "var(--success)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (status !== 'active') {
          e.currentTarget.style.backgroundColor = "var(--surface-container)";
        }
      }}
      onMouseLeave={(e) => {
        if (status !== 'active') {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusInfo.dotColor }}
          />
          <span className="font-semibold" style={{ color: "var(--on-surface)" }}>
            {promotion.item}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <span className="font-medium" style={{ color: "var(--on-surface)" }}>
          €{originalPrice.toFixed(2)}
        </span>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="font-semibold" style={{ color: "var(--primary)" }}>
            {promotion.discount}% OFF
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="space-y-1">
          <span className="font-bold text-lg" style={{ color: "var(--success)" }}>
            €{finalPrice.toFixed(2)}
          </span>
          <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
            Save €{savings.toFixed(2)}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" style={{ color: "var(--on-surface-variant)" }} />
          <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            {new Date(promotion.start_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" style={{ color: "var(--on-surface-variant)" }} />
          <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            {new Date(promotion.end_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" style={{ color: statusInfo.color }} />
          <span className="font-semibold" style={{ color: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-right py-4">
        <Button
          onClick={onDelete}
          disabled={isDeleting}
          variant="outline"
          size="sm"
          style={{ color: "var(--error)" }}
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};