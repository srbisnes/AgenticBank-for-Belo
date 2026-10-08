"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AuditRecord, BalanceSnapshot, Goal } from "./types";
import { initialBalances, initialGoals } from "./mock-data";

interface StateContextType {
  balances: BalanceSnapshot;
  goals: Goal[];
  auditHistory: AuditRecord[];
  aiDecisionsCount: number;
  totalDecisionsCount: number;
  applyIncomeAllocation: (
    amount: number,
    allocations: Record<string, number>,
    newRecords?: AuditRecord[]
  ) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoalAmount: (id: string, newAmount: number) => void;
  addAuditRecord: (agent: string, decision: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const [balances, setBalances] = useState<BalanceSnapshot>(initialBalances);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);
  const [aiDecisionsCount, setAiDecisionsCount] = useState<number>(12);
  const [totalDecisionsCount, setTotalDecisionsCount] = useState<number>(48);

  const applyIncomeAllocation = (
    _amount: number,
    allocations: Record<string, number>,
    newRecords?: AuditRecord[]
  ) => {
    setBalances((prev) => {
      const addedVault = allocations["BELO_VAULT_SWEEP"] || 0;
      const addedTax = allocations["BELO_TAX_ISOLATION_ESCROW"] || 0;
      const addedAvail = allocations["AVAILABLE_BALANCE"] || 0;

      return {
        ...prev,
        available: Math.round((prev.available + addedAvail) * 100) / 100,
        vault: Math.round((prev.vault + addedVault) * 100) / 100,
        taxEscrow: Math.round((prev.taxEscrow + addedTax) * 100) / 100,
      };
    });

    if (newRecords && newRecords.length > 0) {
      setAuditHistory((prev) => [...prev, ...newRecords]);
    }

    setAiDecisionsCount((c) => c + 1);
    setTotalDecisionsCount((c) => c + 1);
  };

  const addGoal = (newGoalData: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `g_${Date.now()}`,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoalAmount = (id: string, newAmount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, currentAmount: newAmount };
          if (updated.currentAmount >= updated.targetAmount) {
            updated.status = "completed";
          }
          return updated;
        }
        return g;
      })
    );
  };

  const addAuditRecord = (agent: string, decision: string) => {
    const timestamp = new Date().toISOString();
    const prevHash =
      auditHistory.length > 0
        ? auditHistory[auditHistory.length - 1].hash
        : "GENESIS";

    const newRecord: AuditRecord = {
      index: auditHistory.length,
      agent,
      decision,
      timestamp,
      prevHash,
      hash: `${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
    };

    setAuditHistory((prev) => [...prev, newRecord]);
  };

  return (
    <StateContext.Provider
      value={{
        balances,
        goals,
        auditHistory,
        aiDecisionsCount,
        totalDecisionsCount,
        applyIncomeAllocation,
        addGoal,
        updateGoalAmount,
        addAuditRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export function useBankState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useBankState must be used within a BankProvider");
  }
  return context;
}
