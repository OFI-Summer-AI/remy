// pages/PromotionsPage/components/AddPromotionDialog.tsx

import React from "react";
import { DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Plus,
  Percent,
  Calendar,
  Search,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { useProducts, useCreatePromotion} from "../hooks/useAddPromotionsDialog";
import { MenuItemCard } from "./MenuItemCard";
import { SelectedItemPreview } from "./SelectItemPreview";
import { Product } from "../types";

interface AddPromotionDialogProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddPromotionDialog: React.FC<AddPromotionDialogProps> = ({
  onSuccess,
  onCancel
}) => {
  const { products, isLoading, error, refetch } = useProducts();
  const { createPromotion, isCreating } = useCreatePromotion();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<Product | null>(null);
  const [discount, setDiscount] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const filteredItems = React.useMemo(
    () =>
      products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const handleSubmit = async () => {
    if (!selectedItem || !discount || !startDate || !endDate) {
      return;
    }

    const discountNum = parseInt(discount);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      return;
    }

    const success = await createPromotion({
      item: selectedItem.id,
      discount: discountNum,
      start_date: startDate,
      end_date: endDate
    });

    if (success) {
      handleCancel();
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setDiscount("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    onCancel?.();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Percent className="h-6 w-6" style={{ color: "var(--primary)" }} />
          Create New Promotion
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-1">
        <div className="space-y-6 pt-4 pb-2">
          {/* Search Menu Items */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Menu Item</Label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--on-surface-variant)" }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name or category..."
                className="pl-10"
                style={{ borderColor: "var(--outline-variant)" }}
                disabled={isLoading || !!error}
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Available Items</Label>
            <div
              className="min-h-60 max-h-60 overflow-y-auto border rounded-lg"
              style={{ borderColor: "var(--outline-variant)" }}
            >
              {isLoading ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-60">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" style={{ color: "var(--primary)" }} />
                  <p style={{ color: "var(--on-surface-variant)" }}>Loading products...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-60">
                  <AlertCircle className="h-8 w-8 mb-3" style={{ color: "var(--error)" }} />
                  <p className="font-semibold mb-1" style={{ color: "var(--error)" }}>Error loading products</p>
                  <p className="text-sm mb-4" style={{ color: "var(--on-surface-variant)" }}>{error}</p>
                  <Button
                    onClick={refetch}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                  </Button>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center h-60 flex flex-col items-center justify-center" style={{ color: "var(--on-surface-variant)" }}>
                  <Tag className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--outline)" }} />
                  <p>No products available</p>
                </div>
              ) : filteredItems.length > 0 ? (
                <div>
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        borderTop: index !== 0 ? `1px solid var(--outline-variant)` : undefined,
                      }}
                    >
                      <MenuItemCard
                        item={item}
                        isSelected={selectedItem?.id === item.id}
                        onClick={() => setSelectedItem(item)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center h-60 flex flex-col items-center justify-center" style={{ color: "var(--on-surface-variant)" }}>
                  <Tag className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--outline)" }} />
                  <p>No items found matching your search</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Item Preview */}
          {selectedItem && (
            <SelectedItemPreview item={selectedItem} discount={discount} />
          )}

          {/* Promotion Details */}
          {selectedItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-base font-semibold flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Discount Percentage
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter discount % (e.g., 15)"
                  style={{ borderColor: "var(--outline-variant)" }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ borderColor: "var(--outline-variant)" }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ borderColor: "var(--outline-variant)" }}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="flex justify-end gap-3 pt-4 border-t mt-4"
        style={{ borderColor: "var(--outline-variant)" }}
      >
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedItem || !discount || !startDate || !endDate || isCreating || isLoading || !!error}
          className="shadow-lg"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
          }}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </>
          )}
        </Button>
      </div>
    </>
  );
};