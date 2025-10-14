// pages/StockAlertsPage/components/AddItemDialog.tsx

import React from "react";
import { DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent } from "@/shared/components/ui/card";
import { 
  PackagePlus, 
  Search, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  RefreshCcw 
} from "lucide-react";
import { useStocks, useCreateStockAlert } from "../hooks/useAddStock";

interface AddItemDialogProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({ 
  onSuccess,
  onCancel 
}) => {
  const { stocks, isLoading, error, refetch } = useStocks();
  const { createStockAlert, isCreating } = useCreateStockAlert();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<Stock | null>(null);
  const [reorderLevel, setReorderLevel] = React.useState("");
  const [maxQuantity, setMaxQuantity] = React.useState("");

  const filteredProducts = React.useMemo(
    () =>
      stocks.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [stocks, searchQuery]
  );

  const handleSubmit = async () => {
    if (!selectedProduct || !reorderLevel || !maxQuantity) {
      return;
    }

    const reorderLevelNum = parseInt(reorderLevel);
    const maxQuantityNum = parseInt(maxQuantity);
    
    if (isNaN(reorderLevelNum) || reorderLevelNum < 0) {
      return;
    }
    
    if (isNaN(maxQuantityNum) || maxQuantityNum < 0) {
      return;
    }

    if (reorderLevelNum > maxQuantityNum) {
      return;
    }

    const success = await createStockAlert({
      stock: selectedProduct.id,
      reorder_level: reorderLevelNum,
      max_quantity: maxQuantityNum
    });

    if (success) {
      handleCancel();
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setReorderLevel("");
    setMaxQuantity("");
    setSearchQuery("");
    onCancel?.();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <PackagePlus className="h-6 w-6" style={{ color: "var(--primary)" }} />
          Add New Item to Stock Monitoring
        </DialogTitle>
      </DialogHeader>
      
      {/* Contenido scrollable con altura fija */}
      <div className="max-h-[calc(85vh-12rem)] overflow-y-auto px-1">
        <div className="space-y-6 pt-4 pb-2">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Search Products</Label>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--on-surface-variant)" }}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or supplier..."
                className="pl-10"
                style={{
                  borderColor: "var(--outline-variant)",
                }}
                disabled={isLoading || !!error}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Available Products</Label>
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
              ) : stocks.length === 0 ? (
                <div className="p-8 text-center h-60 flex flex-col items-center justify-center" style={{ color: "var(--on-surface-variant)" }}>
                  <PackagePlus className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--outline)" }} />
                  <p>No products available</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div>
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="p-4 cursor-pointer transition-colors border-l-4"
                      style={{
                        borderTop: index !== 0 ? `1px solid var(--outline-variant)` : undefined,
                        backgroundColor: selectedProduct?.id === product.id 
                          ? "var(--primary-container)" 
                          : undefined,
                        borderLeftColor: selectedProduct?.id === product.id 
                          ? "var(--primary)" 
                          : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedProduct?.id !== product.id) {
                          e.currentTarget.style.backgroundColor = "var(--surface-container)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedProduct?.id !== product.id) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold" style={{ color: "var(--on-surface)" }}>
                            {product.name}
                          </h4>
                          <p className="text-sm mt-1" style={{ color: "var(--on-surface-variant)" }}>
                            Supplier: {product.supplier}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="font-medium" style={{ color: "var(--success)" }}>
                              Stock: {product.current_quantity} {product.units}
                            </span>
                            <span className="font-medium" style={{ color: "var(--primary)" }}>
                              ${product.unit_price.toFixed(2)} / {product.units}
                            </span>
                          </div>
                        </div>
                        {selectedProduct?.id === product.id && (
                          <CheckCircle className="h-5 w-5 mt-1" style={{ color: "var(--primary)" }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center h-60 flex flex-col items-center justify-center" style={{ color: "var(--on-surface-variant)" }}>
                  <PackagePlus className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--outline)" }} />
                  <p>No products found matching your search</p>
                </div>
              )}
            </div>
          </div>

          {selectedProduct && (
            <Card 
              style={{
                backgroundColor: "var(--primary-container)",
                borderColor: "var(--primary)",
              }}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2" style={{ color: "var(--on-primary-container)" }}>
                  Selected Product
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>Name:</span>
                    <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>Supplier:</span>
                    <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
                      {selectedProduct.supplier}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>Current Stock:</span>
                    <p className="font-medium" style={{ color: "var(--on-primary-container)" }}>
                      {selectedProduct.current_quantity} {selectedProduct.units}
                    </p>
                  </div>
                  <div>
                    <span style={{ color: "var(--on-primary-container)", opacity: 0.7 }}>Unit Price:</span>
                    <p className="font-medium" style={{ color: "var(--success)" }}>
                      ${selectedProduct.unit_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reorder-level" className="text-base font-semibold">
                  Reorder Level (Minimum Threshold)
                </Label>
                <Input
                  id="reorder-level"
                  type="number"
                  min="0"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  placeholder={`Alert when stock falls below... (${selectedProduct.units})`}
                  style={{ borderColor: "var(--outline-variant)" }}
                  required
                />
                <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  You'll be notified when stock falls below this level
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-quantity" className="text-base font-semibold">
                  Maximum Quantity
                </Label>
                <Input
                  id="max-quantity"
                  type="number"
                  min="0"
                  value={maxQuantity}
                  onChange={(e) => setMaxQuantity(e.target.value)}
                  placeholder={`Maximum stock level (${selectedProduct.units})`}
                  style={{ borderColor: "var(--outline-variant)" }}
                  required
                />
                <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                  Target maximum stock to maintain
                </p>
              </div>

              {reorderLevel && maxQuantity && parseInt(reorderLevel) > parseInt(maxQuantity) && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--error-container)" }}>
                  <p className="text-sm font-medium" style={{ color: "var(--on-error-container)" }}>
                    ⚠️ Reorder level cannot be greater than maximum quantity
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Botones fijos en la parte inferior */}
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
          disabled={
            !selectedProduct || 
            !reorderLevel || 
            !maxQuantity || 
            isCreating || 
            isLoading || 
            !!error ||
            parseInt(reorderLevel) > parseInt(maxQuantity)
          }
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
              <PackagePlus className="h-4 w-4 mr-2" />
              Add to Monitoring
            </>
          )}
        </Button>
      </div>
    </>
  );
};