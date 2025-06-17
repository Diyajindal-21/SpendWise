"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export default function BudgetProgress({ 
  initialBudget, 
  currentExpenses 
}: { 
  initialBudget: { amount: number } | null;
  currentExpenses: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = newBudget
    ? (currentExpenses / newBudget) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = (newBudget);

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount || undefined);
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget && 'success' in updatedBudget && updatedBudget.data?.amount) {
      setNewBudget(updatedBudget.data.amount);
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="bg-gradient-to-br from-[#23234a]/80 to-[#181830]/90 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6 pt-6">
    <div className="flex-1">
      <CardTitle className="text-base font-semibold text-white">
        Monthly Budget (Default Account)
      </CardTitle>
      <div className="flex items-center gap-2 mt-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
              className="w-32 bg-[#23234a] border border-white/10 text-white placeholder-[#b0b3c7] rounded-lg focus:ring-2 focus:ring-[#5f5fff] transition"
              placeholder="Enter amount"
              autoFocus
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpdateBudget}
              disabled={isLoading}
              className="hover:bg-green-500/10"
            >
              <Check className="h-4 w-4 text-green-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isLoading}
              className="hover:bg-red-500/10"
            >
              <X className="h-4 w-4 text-rose-400" />
            </Button>
          </div>
        ) : (
          <>
            <CardDescription className="text-[#b0b3c7]">
              {initialBudget
                ? `$${currentExpenses.toFixed(2)} of $${newBudget} spent`
                : "No budget set"}
            </CardDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-7 w-7 hover:bg-[#5f5fff]/10 transition"
            >
              <Pencil className="h-3 w-3 text-white" />
            </Button>
          </>
        )}
      </div>
    </div>
  </CardHeader>
  <CardContent className="px-6 pb-6">
    {initialBudget && (
      <div className="space-y-2">
        <Progress
          value={percentUsed}
          extraStyles={`${
            percentUsed >= 90
              ? "bg-red-500"
              : percentUsed >= 75
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
        <p className="text-xs text-[#b0b3c7] text-right">
          {percentUsed.toFixed(1)}% used
        </p>
      </div>
    )}
  </CardContent>
</Card>

  );
}