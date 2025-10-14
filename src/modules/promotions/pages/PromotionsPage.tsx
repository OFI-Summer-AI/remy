// pages/PromotionsPage/index.tsx

import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { KPIGridView } from "@/shared/components/common/KPIGridView";
import { useGetPromotionsKPIsQuery } from "../store/promotionsApi";
import { PromotionsTable } from "../components/PromotionsTable";
import { usePromotionsManagement } from "../hooks/usePromotionsManagement";

const PromotionsPage: React.FC = () => {
  const {
    promotions,
    isLoading,
    isError,
    isCreating,
    searchQuery,
    setSearchQuery,
    deletingId,
    addPromotion,
    handleDeletePromotion,
    refetch,
  } = usePromotionsManagement();

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center space-y-4">
          <Loader2
            className="h-12 w-12 animate-spin mx-auto"
            style={{ color: "var(--primary)" }}
          />
          <p style={{ color: "var(--on-surface-variant)" }}>
            Loading promotions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Card
          className="max-w-md"
          style={{
            backgroundColor: "var(--surface-container-low)",
            borderColor: "var(--outline-variant)",
          }}
        >
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle
              className="h-12 w-12 mx-auto"
              style={{ color: "var(--error)" }}
            />
            <div>
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--on-surface)" }}
              >
                Error loading promotions
              </h3>
              <p
                className="text-sm mt-2"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Could not fetch promotions data. Please try again.
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full h-full p-6">
        <div className="w-full max-w-none space-y-6">
          {/* Header Stats - Using KPIGridView */}
          <KPIGridView queryHook={useGetPromotionsKPIsQuery} variant="full" />

          {/* Main Content - Promotions Table */}
          <PromotionsTable
            promotions={promotions}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddPromotion={addPromotion}
            onDeletePromotion={handleDeletePromotion}
            deletingId={deletingId}
            isCreating={isCreating}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;