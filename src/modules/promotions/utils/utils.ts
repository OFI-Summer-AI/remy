
// pages/PromotionsPage/utils.ts

import type { PromotionStatus } from '../types';

export const calculateStatus = (startDate: string, endDate: string): PromotionStatus => {
  const today = new Date().toISOString().split('T')[0];
  
  if (startDate <= today && endDate >= today) {
    return 'active';
  } else if (startDate > today) {
    return 'scheduled';
  } else {
    return 'expired';
  }
};

export const calculateFinalPrice = (originalPrice: number, discount: number): number => {
  return originalPrice * (1 - discount / 100);
};

export const calculateSavings = (originalPrice: number, finalPrice: number): number => {
  return originalPrice - finalPrice;
};