import React from "react";
import {
  Card,
  CardContent,
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
  Percent, 
  Calendar, 
  CheckCircle,
  Clock,
  Search,
  Tag,
  Trash2,
  PackagePlus
} from "lucide-react";

/* -------------------- Types -------------------- */
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface Promotion {
  id: number;
  itemId: number;
  itemName: string;
  originalPrice: number;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired';
}

/* -------------------- Constants -------------------- */
const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Pumpkin Soup", category: "Soups", price: 6.5 },
  { id: 2, name: "Quinoa Salad", category: "Salads", price: 9.0 },
  { id: 3, name: "Veggie Lasagna", category: "Pasta", price: 11.5 },
  { id: 4, name: "Margherita Pizza", category: "Pizza", price: 12.0 },
  { id: 5, name: "Truffle Mushroom Pizza", category: "Pizza", price: 15.5 },
  { id: 6, name: "Caesar Salad", category: "Salads", price: 8.5 },
  { id: 7, name: "Tomato Basil Soup", category: "Soups", price: 5.5 },
  { id: 8, name: "Spaghetti Carbonara", category: "Pasta", price: 13.0 },
  { id: 9, name: "Greek Salad", category: "Salads", price: 9.5 },
  { id: 10, name: "Pepperoni Pizza", category: "Pizza", price: 13.5 }
];

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    itemId: 1,
    itemName: "Pumpkin Soup",
    originalPrice: 6.5,
    discount: 15,
    startDate: "2025-09-25",
    endDate: "2025-10-05",
    status: 'active'
  },
  {
    id: 2,
    itemId: 2,
    itemName: "Quinoa Salad",
    originalPrice: 9.0,
    discount: 20,
    startDate: "2025-09-28",
    endDate: "2025-10-10",
    status: 'active'
  },
  {
    id: 3,
    itemId: 5,
    itemName: "Truffle Mushroom Pizza",
    originalPrice: 15.5,
    discount: 10,
    startDate: "2025-10-01",
    endDate: "2025-10-15",
    status: 'scheduled'
  }
];

/* -------------------- Stats Card Component -------------------- */
interface StatsCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  value: number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, iconColor, iconBg, value, label }) => {
  return (
    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${iconBg} rounded-full`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* -------------------- Promotion Row Component -------------------- */
interface PromotionRowProps {
  promotion: Promotion;
  onDelete: () => void;
}

const PromotionRow: React.FC<PromotionRowProps> = ({ promotion, onDelete }) => {
  const finalPrice = promotion.originalPrice * (1 - promotion.discount / 100);
  const savings = promotion.originalPrice - finalPrice;

  const statusConfig = {
    active: {
      color: 'text-green-600',
      icon: CheckCircle,
      label: 'Active',
      dotColor: 'bg-green-400'
    },
    scheduled: {
      color: 'text-blue-600',
      icon: Clock,
      label: 'Scheduled',
      dotColor: 'bg-blue-400'
    },
    expired: {
      color: 'text-gray-600',
      icon: Calendar,
      label: 'Expired',
      dotColor: 'bg-gray-400'
    }
  };

  const status = statusConfig[promotion.status];
  const StatusIcon = status.icon;

  return (
    <TableRow className={`hover:bg-orange-50 transition-colors ${promotion.status === 'active' ? 'bg-green-50/30 border-l-4 border-green-400' : ''}`}>
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status.dotColor}`} />
          <span className="text-gray-900 font-semibold">{promotion.itemName}</span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <span className="text-gray-900 font-medium">
          €{promotion.originalPrice.toFixed(2)}
        </span>
      </TableCell>
      
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-orange-600">
            {promotion.discount}% OFF
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="space-y-1">
          <span className="font-bold text-green-600 text-lg">
            €{finalPrice.toFixed(2)}
          </span>
          <p className="text-xs text-gray-500">
            Save €{savings.toFixed(2)}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(promotion.startDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </TableCell>

      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(promotion.endDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${status.color}`} />
          <span className={`${status.color} font-semibold`}>
            {status.label}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="text-right py-4">
        <Button
          onClick={onDelete}
          variant="outline"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

/* -------------------- Menu Item Card Component -------------------- */
interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onClick: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors hover:bg-orange-50 ${
        isSelected ? 'bg-orange-100 border-l-4 border-orange-500' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Category: {item.category}
          </p>
          <p className="text-lg font-bold text-green-600 mt-2">
            €{item.price.toFixed(2)}
          </p>
        </div>
        {isSelected && (
          <CheckCircle className="h-5 w-5 text-orange-500 mt-1" />
        )}
      </div>
    </div>
  );
};

/* -------------------- Selected Item Preview Component -------------------- */
interface SelectedItemPreviewProps {
  item: MenuItem;
  discount: string;
}

const SelectedItemPreview: React.FC<SelectedItemPreviewProps> = ({ item, discount }) => {
  const finalPrice = discount ? item.price * (1 - parseInt(discount) / 100) : 0;

  return (
    <Card className="bg-orange-50 border-orange-200">
      <CardContent className="p-4">
        <h4 className="font-semibold text-orange-800 mb-3">Selected Item</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <p className="font-medium">{item.name}</p>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <p className="font-medium">{item.category}</p>
          </div>
          <div>
            <span className="text-gray-600">Original Price:</span>
            <p className="font-medium text-gray-900">€{item.price.toFixed(2)}</p>
          </div>
          {discount && (
            <div>
              <span className="text-gray-600">Final Price:</span>
              <p className="font-bold text-green-600">€{finalPrice.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* -------------------- Add Promotion Dialog Component -------------------- */
interface AddPromotionDialogProps {
  onAdd: (menuItem: MenuItem, discount: number, startDate: string, endDate: string) => void;
}

const AddPromotionDialog: React.FC<AddPromotionDialogProps> = ({ onAdd }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);
  const [discount, setDiscount] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const filteredItems = React.useMemo(
    () =>
      MENU_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const finalPrice = selectedItem && discount 
    ? selectedItem.price * (1 - parseInt(discount) / 100)
    : 0;

  const handleSubmit = () => {
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

    onAdd(selectedItem, discountNum, startDate, endDate);
    setSelectedItem(null);
    setDiscount("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setDiscount("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Percent className="h-6 w-6 text-orange-600" />
          Create New Promotion
        </DialogTitle>
      </DialogHeader>
      
      <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-1">
        <div className="space-y-6 pt-4 pb-2">
          {/* Search Menu Items */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Menu Item</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name or category..."
                className="pl-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Available Items</Label>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredItems.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Tag className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  No items found matching your search
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
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  required
                />
                {discount && parseInt(discount) > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Customer saves €{(selectedItem.price - finalPrice).toFixed(2)}
                  </p>
                )}
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
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
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
                    className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <Button 
          variant="outline"
          onClick={handleCancel}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedItem || !discount || !startDate || !endDate}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>
    </>
  );
};

/* -------------------- Main Component -------------------- */
const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = React.useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [query, setQuery] = React.useState("");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const { toast } = useToast();

  const filtered = React.useMemo(
    () =>
      promotions.filter((promo) =>
        promo.itemName.toLowerCase().includes(query.toLowerCase())
      ),
    [promotions, query]
  );

  const activeCount = React.useMemo(
    () => promotions.filter(p => p.status === 'active').length,
    [promotions]
  );

  const scheduledCount = React.useMemo(
    () => promotions.filter(p => p.status === 'scheduled').length,
    [promotions]
  );

  const addPromotion = (menuItem: MenuItem, discount: number, startDate: string, endDate: string) => {
    const id = Math.max(...promotions.map(p => p.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    let status: 'active' | 'scheduled' | 'expired' = 'scheduled';
    if (startDate <= today && endDate >= today) {
      status = 'active';
    } else if (endDate < today) {
      status = 'expired';
    }

    const newPromotion: Promotion = {
      id,
      itemId: menuItem.id,
      itemName: menuItem.name,
      originalPrice: menuItem.price,
      discount,
      startDate,
      endDate,
      status
    };
    
    setPromotions(prev => [...prev, newPromotion]);
    setShowAddDialog(false);
    
    toast({
      title: "Promotion created",
      description: `${discount}% off ${menuItem.name} has been ${status === 'active' ? 'activated' : 'scheduled'}`,
    });
  };

  const deletePromotion = (id: number) => {
    const promo = promotions.find(p => p.id === id);
    setPromotions(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Promotion deleted",
      description: `Promotion for ${promo?.itemName} has been removed`,
    });
  };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full h-full p-6">
        <div className="w-full max-w-none space-y-6">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              icon={Tag}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
              value={promotions.length}
              label="Total Promotions"
            />
            <StatsCard
              icon={CheckCircle}
              iconColor="text-green-600"
              iconBg="bg-green-100"
              value={activeCount}
              label="Active Promotions"
            />
            <StatsCard
              icon={Clock}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              value={scheduledCount}
              label="Scheduled Promotions"
            />
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur flex-1">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Percent className="h-7 w-7" />
                  Promotions Management
                </h2>
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search promotions..."
                      className="pl-10 md:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900"
                    />
                  </div>
                  
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-orange-600 hover:bg-white/90 font-medium shadow-lg">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Promotion
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <AddPromotionDialog onAdd={addPromotion} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <CardContent className="p-0 flex-1">
              <div className="overflow-x-auto h-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50 border-b-2 border-orange-100">
                      <TableHead className="font-semibold text-gray-700">Item</TableHead>
                      <TableHead className="font-semibold text-gray-700">Original Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">Discount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Final Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">Start Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">End Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((promo) => (
                      <PromotionRow 
                        key={promo.id} 
                        promotion={promo}
                        onDelete={() => deletePromotion(promo.id)}
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

export default PromotionsPage;