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
import { Plus, Minus } from "lucide-react";

/* -------------------- Types -------------------- */
interface Item {
  id: number;
  name: string;
  qty: number;
  unit: string;
}

/* -------------------- Constants -------------------- */
const ITEMS: Item[] = [
  { id: 1, name: "Tomatoes", qty: 8, unit: "kg" },
  { id: 2, name: "Mozzarella", qty: 2, unit: "kg" },
  { id: 3, name: "Flour", qty: 25, unit: "kg" },
  { id: 4, name: "Olive Oil", qty: 4, unit: "L" },
  { id: 5, name: "Basil", qty: 1, unit: "kg" },
];

const LOW_THRESHOLD = 5;
const WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/1fa87292-48fa-494f-915b-0ddf97ef9110";

/* -------------------- Component -------------------- */
const StockAlertsPage: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [reorderQuantities, setReorderQuantities] = React.useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = React.useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const filtered = React.useMemo(
    () =>
      ITEMS.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
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
        
        // Reset the reorder quantity after successful order
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

  return (
    <section aria-label="Stock and Reorder Alerts" className="space-y-3">
      <Card className="rounded-2xl shadow-md">
        {/* Header with search */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Stock & Reorder Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            <label
              htmlFor="stock-search"
              className="text-sm text-muted-foreground"
            >
              Search
            </label>
            <Input
              id="stock-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items"
              aria-label="Search stock items"
              className="w-48"
            />
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

/* -------------------- Subcomponent -------------------- */
interface StockRowProps {
  item: Item;
  reorderQuantity: number;
  onQuantityChange: (delta: number) => void;
  onReorder: () => void;
  isLoading: boolean;
}

const StockRow: React.FC<StockRowProps> = ({ 
  item, 
  reorderQuantity, 
  onQuantityChange, 
  onReorder,
  isLoading 
}) => {
  const isLow = item.qty <= LOW_THRESHOLD;

  return (
    <TableRow className={isLow ? "bg-destructive/10" : undefined}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>
        {item.qty} {item.unit}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(-1)}
            disabled={reorderQuantity <= 1 || isLoading}
            className="h-8 w-8 p-0 rounded-full"
            aria-label={`Decrease ${item.name} quantity`}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="min-w-[3rem] text-center font-medium">
            {reorderQuantity} {item.unit}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(1)}
            disabled={isLoading}
            className="h-8 w-8 p-0 rounded-full"
            aria-label={`Increase ${item.name} quantity`}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        {isLow ? (
          <span className="text-destructive font-medium">Low stock</span>
        ) : (
          <span className="text-muted-foreground">OK</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="secondary"
          aria-label={`Reorder ${item.name}`}
          size="sm"
          className="rounded-lg"
          onClick={onReorder}
          disabled={isLoading}
        >
          {isLoading ? "Ordering..." : "Reorder"}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default StockAlertsPage;