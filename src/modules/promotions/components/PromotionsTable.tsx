// pages/PromotionsPage/components/PromotionsTable.tsx

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Plus,
  Percent,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";
import DataTable from "@/shared/components/common/DataTable";
import { AddPromotionDialog } from "./AddPromotionDialog";
import { calculateStatus } from "../utils/utils";
import type { PromotionsTableProps, Promotion } from "../types";

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  promotions,
  searchQuery,
  onSearchChange,
  onAddPromotion,
  onDeletePromotion,
  deletingId,
  isCreating,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddPromotion = useCallback(
    async (
      menuItem: any,
      discount: number,
      startDate: string,
      endDate: string
    ) => {
      const success = await onAddPromotion(menuItem, discount, startDate, endDate);
      if (success) {
        setShowAddDialog(false);
      }
    },
    [onAddPromotion]
  );

  // Column definitions - EXACT REPLICA of PromotionRow.tsx
  const columns = useMemo(
    () => [
      {
        key: "item",
        label: "Item",
        sortable: true,
        render: (value: string, row: Promotion) => {
          const status = calculateStatus(row.start_date, row.end_date);
          const statusConfig = {
            active: { dotColor: "var(--success)" },
            scheduled: { dotColor: "var(--secondary)" },
            expired: { dotColor: "var(--outline)" },
          };
          const dotColor = statusConfig[status]?.dotColor || "var(--outline)";

          return (
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
              <span className="font-semibold" style={{ color: "var(--on-surface)" }}>
                {value}
              </span>
            </div>
          );
        },
      },
      {
        key: "original_price",
        label: "Original Price",
        sortable: true,
        render: (value: any, row: Promotion) => {
          const originalPrice = row.original_price || 0;
          return (
            <span className="font-medium" style={{ color: "var(--on-surface)" }}>
              €{originalPrice.toFixed(2)}
            </span>
          );
        },
      },
      {
        key: "discount",
        label: "Discount",
        sortable: true,
        render: (value: any, row: Promotion) => {
          const discountNum = row.discount;
          return (
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4" style={{ color: "var(--primary)" }} />
              <span className="font-semibold" style={{ color: "var(--primary)" }}>
                {discountNum}% OFF
              </span>
            </div>
          );
        },
      },
      {
        key: "calculated_price",
        label: "Final Price",
        sortable: false,
        render: (_: any, row: Promotion) => {
          const discountNum = row.discount;
          const originalPrice = row.original_price || 0;
          const finalPrice = originalPrice * (1 - discountNum / 100);
          const savings = originalPrice - finalPrice;

          return (
            <div className="space-y-1">
              <span className="font-bold text-lg" style={{ color: "var(--success)" }}>
                €{finalPrice.toFixed(2)}
              </span>
              <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                Save €{savings.toFixed(2)}
              </p>
            </div>
          );
        },
      },
      {
        key: "start_date",
        label: "Start Date",
        sortable: true,
        render: (value: any, row: Promotion) => (
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4"
              style={{ color: "var(--on-surface-variant)" }}
            />
            <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
              {new Date(row.start_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ),
      },
      {
        key: "end_date",
        label: "End Date",
        sortable: true,
        render: (value: any, row: Promotion) => (
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4"
              style={{ color: "var(--on-surface-variant)" }}
            />
            <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
              {new Date(row.end_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: false,
        render: (_: any, row: Promotion) => {
          const status = calculateStatus(row.start_date, row.end_date);
          const statusConfig = {
            active: {
              color: "var(--success)",
              icon: CheckCircle,
              label: "Active",
            },
            scheduled: {
              color: "var(--secondary)",
              icon: Clock,
              label: "Scheduled",
            },
            expired: {
              color: "var(--on-surface-variant)",
              icon: Calendar,
              label: "Expired",
            },
          };

          const statusInfo = statusConfig[status] || statusConfig.expired;
          const StatusIcon = statusInfo.icon;

          return (
            <div className="flex items-center gap-2">
              <StatusIcon
                className="h-4 w-4"
                style={{ color: statusInfo.color }}
              />
              <span className="font-semibold" style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  // Custom delete handler for Actions column
  const handleDelete = useCallback(
    (row: Promotion) => {
      onDeletePromotion(row.id, row.item);
    },
    [onDeletePromotion]
  );

  // Custom render for delete button
  const renderDeleteAction = useCallback(
    (row: Promotion) => {
      const isDeleting = deletingId === row.id;
      return (
        <Button
          onClick={() => handleDelete(row)}
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
      );
    },
    [deletingId, handleDelete]
  );

  return (
    <Card
      className="border shadow-xl flex-1"
      style={{
        backgroundColor: "var(--surface-container-low)",
        borderColor: "var(--outline-variant)",
      }}
    >
      <div
        className="rounded-t-xl p-6"
        style={{
          background: `linear-gradient(to right, var(--primary), var(--primary))`,
          color: "var(--on-primary)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Percent className="h-7 w-7" />
            Promotions Management
          </h2>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--on-primary)", opacity: 0.7 }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search promotions..."
                className="pl-10 md:w-64 border-0"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "var(--on-primary)",
                }}
              />
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  className="font-medium shadow-lg"
                  style={{
                    backgroundColor: "var(--on-primary)",
                    color: "var(--primary)",
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <AddPromotionDialog
                  onAdd={handleAddPromotion}
                  isCreating={isCreating}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <CardContent className="p-0 flex-1">
        <DataTable
          data={promotions}
          columns={columns}
          searchPlaceholder="Search promotions..."
          loading={false}
          customActionRender={renderDeleteAction}
        />
      </CardContent>
    </Card>
  );
};