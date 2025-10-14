// pages/StockAlertsPage/components/StockTable.tsx

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Plus,
  PackagePlus,
  Minus,
  Edit3,
  Save,
  X,
  Loader2,
  Search,
  AlertTriangle,
} from "lucide-react";
import DataTable from "@/shared/components/common/DataTable";
import { AddItemDialog } from "./AddItemDialog";
import type { StockTableProps, StockItem } from "../types";

export const StockTable: React.FC<StockTableProps> = ({
  items,
  searchQuery,
  onSearchChange,
  reorderQuantities,
  onQuantityChange,
  onReorder,
  isReordering,
  editingThreshold,
  newThresholdValue,
  onThresholdValueChange,
  onStartEditingThreshold,
  onSaveThreshold,
  onCancelEditingThreshold,
  onAddItem,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddItem = useCallback(
    (product: any, minThreshold: number) => {
      setShowAddDialog(false);
      onAddItem(product, minThreshold);
    },
    [onAddItem]
  );

  // Column definitions with render functions
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Item",
        sortable: true,
        render: (value: string, row: StockItem) => {
          const isLow = row.current_stock <= row.min_threshold;
          return (
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isLow ? "var(--error)" : "var(--success)",
                }}
              />
              <span
                className="font-semibold"
                style={{ color: "var(--on-surface)" }}
              >
                {value}
              </span>
            </div>
          );
        },
      },
      {
        key: "supplier",
        label: "Supplier",
        sortable: true,
        render: (value: string) => (
          <span className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            {value}
          </span>
        ),
      },
      {
        key: "current_stock",
        label: "Current Stock",
        sortable: true,
        render: (value: number, row: StockItem) => {
          const isLow = value <= row.min_threshold;
          const unit = row.unit || "units";
          return (
            <div className="flex items-center gap-2">
              <span
                className="font-semibold"
                style={{ color: isLow ? "var(--error)" : "var(--on-surface)" }}
              >
                {value} {unit}
              </span>
              {isLow && (
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: "var(--error)" }}
                />
              )}
            </div>
          );
        },
      },
      {
        key: "min_threshold",
        label: "Min Threshold",
        sortable: true,
        render: (value: number, row: StockItem) => {
          const unit = row.unit || "units";
          const isEditing = editingThreshold === row.id;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  value={newThresholdValue}
                  onChange={(e) => onThresholdValueChange(e.target.value)}
                  className="w-20 h-8"
                  type="number"
                  min="0"
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {unit}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSaveThreshold(row.id)}
                  className="h-8 w-8 p-0"
                  style={{ color: "var(--success)" }}
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCancelEditingThreshold}
                  className="h-8 w-8 p-0"
                  style={{ color: "var(--error)" }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <span
                className="font-medium"
                style={{ color: "var(--on-surface)" }}
              >
                {value} {unit}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStartEditingThreshold(row)}
                className="h-6 w-6 p-0"
                style={{ color: "var(--on-surface-variant)" }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      },
      {
        key: "unit_price",
        label: "Unit Price",
        sortable: true,
        render: (value: number) => (
          <span className="font-semibold" style={{ color: "var(--success)" }}>
            ${value.toFixed(2)}
          </span>
        ),
      },
      {
        key: "reorder_quantity",
        label: "Reorder Qty",
        render: (_: any, row: StockItem) => {
          const quantity = reorderQuantities[row.id] || 1;
          const unit = row.unit || "units";
          const isLoading = isReordering[row.id] || false;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(row.id, -1)}
                disabled={quantity <= 1 || isLoading}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span
                className="min-w-[4rem] text-center font-semibold"
                style={{ color: "var(--on-surface)" }}
              >
                {quantity} {unit}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(row.id, 1)}
                disabled={isLoading}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value: string) => (
          <span
            className="text-sm font-medium"
            style={{
              color:
                value === "In Stock"
                  ? "var(--success)"
                  : value.includes("Request")
                  ? "var(--primary)"
                  : "var(--on-surface-variant)",
            }}
          >
            {value}
          </span>
        ),
      },
    ],
    [
      editingThreshold,
      newThresholdValue,
      reorderQuantities,
      isReordering,
      onThresholdValueChange,
      onSaveThreshold,
      onCancelEditingThreshold,
      onStartEditingThreshold,
      onQuantityChange,
    ]
  );

  // Custom reorder handler
  const handleReorder = useCallback(
    (row: StockItem) => {
      const isLow = row.current_stock <= row.min_threshold;
      onReorder(row);
    },
    [onReorder]
  );

  return (
    <Card
      className="border shadow-xl flex-1"
      style={{
        backgroundColor: "var(--surface-container-low)",
        borderColor: "var(--outline-variant)",
      }}
    >
      <CardHeader
        className="rounded-t-xl"
        style={{
          background: `var(--chart-1)`,
          color: "var(--on-primary)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <PackagePlus className="h-7 w-7" />
            Stock & Reorder Management
          </CardTitle>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--on-primary)", opacity: 0.7 }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search items..."
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
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                <AddItemDialog onAdd={handleAddItem} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <DataTable
          data={items}
          columns={columns}
          searchPlaceholder="Search items..."
          loading={false}
          onTakeFirstAction={handleReorder}
        />
      </CardContent>
    </Card>
  );
};