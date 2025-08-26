import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { id: 1, name: "Tomatoes", qty: 8, unit: "kg" },
  { id: 2, name: "Mozzarella", qty: 2, unit: "kg" },
  { id: 3, name: "Flour", qty: 25, unit: "kg" },
  { id: 4, name: "Olive Oil", qty: 4, unit: "L" },
  { id: 5, name: "Basil", qty: 1, unit: "kg" },
];

const LOW_THRESHOLD = 5;

const StockAlerts: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    return ITEMS.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <section aria-label="Stock and Reorder Alerts" className="space-y-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Stock & Reorder Alerts</CardTitle>
          <div className="flex items-center gap-2">
            <label htmlFor="stock-search" className="text-sm text-muted-foreground">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const low = item.qty <= LOW_THRESHOLD;
                return (
                  <TableRow key={item.id} className={low ? "bg-destructive/10" : undefined}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.qty} {item.unit}
                    </TableCell>
                    <TableCell>
                      {low ? (
                        <span className="text-destructive">Low stock</span>
                      ) : (
                        <span className="text-muted-foreground">OK</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" aria-label={`Reorder ${item.name}`}>
                        Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default StockAlerts;
