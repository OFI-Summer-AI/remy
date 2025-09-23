import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { 
  Plus, 
  Minus, 
  PackagePlus, 
  AlertTriangle, 
  CheckCircle,
  Edit3,
  Save,
  X,
  Search
} from "lucide-react";

/* -------------------- Types -------------------- */
interface Item {
  id: number;
  name: string;
  qty: number;
  unit: string;
  minThreshold: number;
  supplier?: string;
  unitPrice?: number;
}

interface AvailableProduct {
  id: number;
  name: string;
  current_quantity: number;
  units: string;
  supplier: string;
  unit_price: number;
}

/* -------------------- Constants -------------------- */
const INITIAL_ITEMS: Item[] = [
  { id: 1, name: "Tomatoes", qty: 8, unit: "kg", minThreshold: 5, supplier: "Fresh Farm Co.", unitPrice: 3.50 },
  { id: 2, name: "Mozzarella", qty: 2, unit: "kg", minThreshold: 3, supplier: "Dairy Express", unitPrice: 12.00 },
  { id: 3, name: "Flour", qty: 25, unit: "kg", minThreshold: 10, supplier: "Mill & Co.", unitPrice: 2.20 },
  { id: 4, name: "Olive Oil", qty: 4, unit: "L", minThreshold: 2, supplier: "Mediterranean Oil", unitPrice: 8.75 },
  { id: 5, name: "Basil", qty: 1, unit: "kg", minThreshold: 2, supplier: "Herb Garden", unitPrice: 15.00 },
];

const AVAILABLE_PRODUCTS: AvailableProduct[] = [
  { id: 101, name: "Oregano", current_quantity: 50, units: "kg", supplier: "Herb Garden", unit_price: 18.50 },
  { id: 102, name: "Parmesan Cheese", current_quantity: 15, units: "kg", supplier: "Dairy Express", unit_price: 25.00 },
  { id: 103, name: "San Marzano Tomatoes", current_quantity: 100, units: "kg", supplier: "Italian Imports", unit_price: 4.80 },
  { id: 104, name: "Buffalo Mozzarella", current_quantity: 20, units: "kg", supplier: "Artisan Dairy", unit_price: 18.00 },
  { id: 105, name: "Extra Virgin Olive Oil", current_quantity: 30, units: "L", supplier: "Premium Oils", unit_price: 15.20 },
  { id: 106, name: "Pizza Dough Mix", current_quantity: 80, units: "kg", supplier: "Baking Solutions", unit_price: 3.40 },
  { id: 107, name: "Prosciutto", current_quantity: 12, units: "kg", supplier: "Italian Meats", unit_price: 35.00 },
  { id: 108, name: "Arugula", current_quantity: 25, units: "kg", supplier: "Green Leafs", unit_price: 6.50 },
  { id: 109, name: "Pine Nuts", current_quantity: 8, units: "kg", supplier: "Nut Suppliers", unit_price: 45.00 },
  { id: 110, name: "Balsamic Vinegar", current_quantity: 40, units: "L", supplier: "Vinegar Co.", unit_price: 12.30 }
];

const WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/1fa87292-48fa-494f-915b-0ddf97ef9110";

/* -------------------- Component -------------------- */
const StockAlertsPage: React.FC = () => {
  const [items, setItems] = React.useState<Item[]>(INITIAL_ITEMS);
  const [query, setQuery] = React.useState("");
  const [reorderQuantities, setReorderQuantities] = React.useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = React.useState<Record<number, boolean>>({});
  const [editingThreshold, setEditingThreshold] = React.useState<number | null>(null);
  const [newThresholdValue, setNewThresholdValue] = React.useState<string>("");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const { toast } = useToast();

  const filtered = React.useMemo(
    () =>
      items.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  const lowStockCount = React.useMemo(
    () => items.filter(item => item.qty <= item.minThreshold).length,
    [items]
  );

  const updateReorderQuantity = (itemId: number, delta: number) => {
    setReorderQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 1) + delta)
    }));
  };

  const handleReorder = async (item: Item) => {
    const quantity = reorderQuantities[item.id] || 1;
    
    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, [item.id]: true }));

    try {
      const queryParams = new URLSearchParams({
        product_name: item.name,
        quantity: quantity.toString(),
        units: item.unit
      });

      const response = await fetch(`${WEBHOOK_URL}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast({
          title: "Order sent successfully!",
          description: `Requested ${quantity} ${item.unit} of ${item.name}`,
        });
        
        setReorderQuantities(prev => ({
          ...prev,
          [item.id]: 1
        }));
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Reorder failed:', error);
      toast({
        title: "Order failed",
        description: "Could not process the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const startEditingThreshold = (item: Item) => {
    setEditingThreshold(item.id);
    setNewThresholdValue(item.minThreshold.toString());
  };

  const saveThreshold = (itemId: number) => {
    const newValue = parseInt(newThresholdValue);
    if (isNaN(newValue) || newValue < 0) {
      toast({
        title: "Invalid threshold",
        description: "Threshold must be a positive number",
        variant: "destructive",
      });
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, minThreshold: newValue }
        : item
    ));

    setEditingThreshold(null);
    setNewThresholdValue("");

    toast({
      title: "Threshold updated",
      description: `Minimum stock threshold updated successfully`,
    });
  };

  const cancelEditingThreshold = () => {
    setEditingThreshold(null);
    setNewThresholdValue("");
  };

  const addNewItem = (product: AvailableProduct, minThreshold: number) => {
    const id = Math.max(...items.map(i => i.id), 0) + 1;
    const newItem: Item = {
      id,
      name: product.name,
      qty: product.current_quantity,
      unit: product.units,
      minThreshold,
      supplier: product.supplier,
      unitPrice: product.unit_price
    };
    
    setItems(prev => [...prev, newItem]);
    setShowAddDialog(false);
    
    toast({
      title: "Item added",
      description: `${product.name} has been added to stock monitoring`,
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full h-full p-6">
        <div className="w-full max-w-none space-y-6">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <PackagePlus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
                    <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{items.length - lowStockCount}</p>
                    <p className="text-sm text-gray-600">Items in Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur flex-1">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <PackagePlus className="h-7 w-7" />
                  Stock & Reorder Management
                </CardTitle>
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search items..."
                      className="pl-10 md:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900"
                    />
                  </div>
                  
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-orange-600 hover:bg-white/90 font-medium shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                      <AddItemDialog onAdd={addNewItem} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1">
              <div className="overflow-x-auto h-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50 border-b-2 border-orange-100">
                      <TableHead className="font-semibold text-gray-700">Item</TableHead>
                      <TableHead className="font-semibold text-gray-700">Supplier</TableHead>
                      <TableHead className="font-semibold text-gray-700">Current Stock</TableHead>
                      <TableHead className="font-semibold text-gray-700">Min Threshold</TableHead>
                      <TableHead className="font-semibold text-gray-700">Unit Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">Reorder Qty</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => (
                      <StockRow 
                        key={item.id} 
                        item={item}
                        reorderQuantity={reorderQuantities[item.id] || 1}
                        onQuantityChange={(delta) => updateReorderQuantity(item.id, delta)}
                        onReorder={() => handleReorder(item)}
                        isLoading={isLoading[item.id] || false}
                        isEditingThreshold={editingThreshold === item.id}
                        newThresholdValue={newThresholdValue}
                        onThresholdValueChange={setNewThresholdValue}
                        onStartEditingThreshold={() => startEditingThreshold(item)}
                        onSaveThreshold={() => saveThreshold(item.id)}
                        onCancelEditingThreshold={cancelEditingThreshold}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Subcomponent: Stock Row -------------------- */
interface StockRowProps {
  item: Item;
  reorderQuantity: number;
  onQuantityChange: (delta: number) => void;
  onReorder: () => void;
  isLoading: boolean;
  isEditingThreshold: boolean;
  newThresholdValue: string;
  onThresholdValueChange: (value: string) => void;
  onStartEditingThreshold: () => void;
  onSaveThreshold: () => void;
  onCancelEditingThreshold: () => void;
}

const StockRow: React.FC<StockRowProps> = ({ 
  item, 
  reorderQuantity, 
  onQuantityChange, 
  onReorder,
  isLoading,
  isEditingThreshold,
  newThresholdValue,
  onThresholdValueChange,
  onStartEditingThreshold,
  onSaveThreshold,
  onCancelEditingThreshold
}) => {
  const isLow = item.qty <= item.minThreshold;

  return (
    <TableRow className={`hover:bg-orange-25 transition-colors ${isLow ? "bg-red-50 border-l-4 border-red-400" : "hover:bg-orange-50"}`}>
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isLow ? 'bg-red-400' : 'bg-green-400'}`} />
          <span className="text-gray-900 font-semibold">{item.name}</span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-sm text-gray-600">{item.supplier || "N/A"}</span>
      </TableCell>
      
      <TableCell className="py-4">
        <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
          {item.qty} {item.unit}
        </span>
      </TableCell>

      <TableCell className="py-4">
        {isEditingThreshold ? (
          <div className="flex items-center gap-2">
            <Input
              value={newThresholdValue}
              onChange={(e) => onThresholdValueChange(e.target.value)}
              className="w-20 h-8"
              type="number"
              min="0"
            />
            <span className="text-sm text-gray-500">{item.unit}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onSaveThreshold}
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancelEditingThreshold}
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">
              {item.minThreshold} {item.unit}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={onStartEditingThreshold}
              className="h-6 w-6 p-0 text-gray-400 hover:text-orange-600 hover:bg-orange-100"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>

      <TableCell className="py-4">
        <span className="font-semibold text-green-600">
          ${item.unitPrice?.toFixed(2) || "N/A"}
        </span>
      </TableCell>
      
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(-1)}
            disabled={reorderQuantity <= 1 || isLoading}
            className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:border-red-300"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="min-w-[4rem] text-center font-semibold text-gray-900">
            {reorderQuantity} {item.unit}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(1)}
            disabled={isLoading}
            className="h-8 w-8 p-0 rounded-full hover:bg-orange-50 hover:border-orange-300"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      
      <TableCell className="py-4">
        {isLow ? (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-semibold">Low Stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600 font-medium">In Stock</span>
          </div>
        )}
      </TableCell>
      
      <TableCell className="text-right py-4">
        <Button
          onClick={onReorder}
          disabled={isLoading}
          className={`font-medium shadow-sm ${
            isLow 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
          size="sm"
        >
          {isLoading ? "Ordering..." : "Reorder"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

/* -------------------- Subcomponent: Add Item Dialog -------------------- */
interface AddItemDialogProps {
  onAdd: (product: AvailableProduct, minThreshold: number) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({ onAdd }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<AvailableProduct | null>(null);
  const [minThreshold, setMinThreshold] = React.useState("");

  const filteredProducts = React.useMemo(
    () =>
      AVAILABLE_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const handleSubmit = () => {
    if (!selectedProduct || !minThreshold) {
      return;
    }

    const threshold = parseInt(minThreshold);
    if (isNaN(threshold) || threshold < 0) {
      return;
    }

    onAdd(selectedProduct, threshold);
    setSelectedProduct(null);
    setMinThreshold("");
    setSearchQuery("");
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <PackagePlus className="h-6 w-6 text-orange-600" />
          Add New Item to Stock Monitoring
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 pt-4">
        {/* Search Products */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or supplier..."
              className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Available Products</Label>
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-orange-50 ${
                      selectedProduct?.id === product.id 
                        ? 'bg-orange-100 border-l-4 border-orange-500' 
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Supplier: {product.supplier}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-green-600 font-medium">
                            Stock: {product.current_quantity} {product.units}
                          </span>
                          <span className="text-orange-600 font-medium">
                            ${product.unit_price.toFixed(2)} / {product.units}
                          </span>
                        </div>
                      </div>
                      {selectedProduct?.id === product.id && (
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <PackagePlus className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                No products found matching your search
              </div>
            )}
          </div>
        </div>

        {/* Selected Product Details */}
        {selectedProduct && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Selected Product</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Supplier:</span>
                  <p className="font-medium">{selectedProduct.supplier}</p>
                </div>
                <div>
                  <span className="text-gray-600">Current Stock:</span>
                  <p className="font-medium">{selectedProduct.current_quantity} {selectedProduct.units}</p>
                </div>
                <div>
                  <span className="text-gray-600">Unit Price:</span>
                  <p className="font-medium text-green-600">${selectedProduct.unit_price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minimum Threshold */}
        {selectedProduct && (
          <div className="space-y-2">
            <Label htmlFor="min-threshold" className="text-base font-semibold">
              Set Minimum Stock Threshold
            </Label>
            <Input
              id="min-threshold"
              type="number"
              min="0"
              value={minThreshold}
              onChange={(e) => setMinThreshold(e.target.value)}
              placeholder={`Alert when stock falls below... (${selectedProduct.units})`}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline"
            onClick={() => {
              setSelectedProduct(null);
              setMinThreshold("");
              setSearchQuery("");
            }}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedProduct || !minThreshold}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
          >
            Add to Monitoring
          </Button>
        </div>
      </div>
    </>
  );
};

export default StockAlertsPage;