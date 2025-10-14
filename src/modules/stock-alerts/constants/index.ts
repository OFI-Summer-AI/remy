
// pages/StockAlertsPage/constants.ts

import type { AvailableProduct } from '../types';

export const WEBHOOK_URL = "https://n8n.sofiatechnology.ai/webhook/1fa87292-48fa-494f-915b-0ddf97ef9110";

export const AVAILABLE_PRODUCTS: AvailableProduct[] = [
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