// pages/PromotionsPage/hooks/usePromotionsManagement.ts

import React from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  useGetPromotionsTableQuery,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
} from "../store/promotionsApi";
import { calculateStatus } from "../utils/utils";
import type { MenuItem } from "../types";

export const usePromotionsManagement = () => {
  const { data: promotions = [], isLoading, isError, refetch } = useGetPromotionsTableQuery();
  const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const { toast } = useToast();

  // Local state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Filtered promotions based on search
  const filteredPromotions = React.useMemo(
    () =>
      promotions.filter((promo) =>
        promo.item.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [promotions, searchQuery]
  );

  // Add new promotion
  const addPromotion = async (
    menuItem: MenuItem,
    discount: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      await createPromotion({
        item_id: menuItem.id,
        item_name: menuItem.name,
        original_price: menuItem.price,
        discount,
        start_date: startDate,
        end_date: endDate,
      }).unwrap();

      const status = calculateStatus(startDate, endDate);
      toast({
        title: "Promotion created",
        description: `${discount}% off ${menuItem.name} has been ${
          status === 'active' ? 'activated' : 'scheduled'
        }`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Failed to create promotion",
        description: "Could not create the promotion. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete promotion
  const handleDeletePromotion = async (id: string, itemName: string) => {
    setDeletingId(id);
    try {
      await deletePromotion(id).unwrap();

      toast({
        title: "Promotion deleted",
        description: `Promotion for ${itemName} has been removed`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete promotion",
        description: "Could not delete the promotion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return {
    promotions: filteredPromotions,
    isLoading,
    isError,
    isCreating,
    searchQuery,
    setSearchQuery,
    deletingId,
    addPromotion,
    handleDeletePromotion,
    refetch,
  };
};