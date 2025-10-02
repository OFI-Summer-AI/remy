
// components/iconMap.ts

import {
  ShoppingCart,
  Users,
  Utensils,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { IconType } from "../../../shared/types";

export const iconMap: Record<IconType, any> = {
  shopping_cart: ShoppingCart,
  users: Users,
  utensils: Utensils,
  alert_triangle: AlertTriangle,
  dollar_sign: DollarSign,
  trending_up: TrendingUp,
  package: Package,
};
