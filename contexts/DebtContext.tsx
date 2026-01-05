import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DebtStatus = 'Unpaid' | 'Paid';

export interface Debt {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: DebtStatus;
  creditor: string; // Pemberi hutang
  createdAt: Date;
}

interface DebtContextType {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: string, debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  deleteDebt: (id: string) => void;
  toggleDebtStatus: (id: string) => void;
}

const DebtContext = createContext<DebtContextType | undefined>(undefined);

export function DebtProvider({ children }: { children: ReactNode }) {
  const [debts, setDebts] = useState<Debt[]>([]);

  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id: string, debt: Omit<Debt, 'id' | 'createdAt'>) => {
    setDebts(debts.map(d => {
      if (d.id === id) {
        return { ...debt, id, createdAt: d.createdAt };
      }
      return d;
    }));
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const toggleDebtStatus = (id: string) => {
    setDebts(debts.map(d => 
      d.id === id 
        ? { ...d, status: d.status === 'Unpaid' ? 'Paid' : 'Unpaid' }
        : d
    ));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, toggleDebtStatus }}>
      {children}
    </DebtContext.Provider>
  );
}

export function useDebts() {
  const context = useContext(DebtContext);

  if (!context) {
    console.error(
      'useDebts dipakai di luar DebtProvider'
    );

    return {
      debts: [],
      addDebt: () => {},
      updateDebt: () => {},
      deleteDebt: () => {},
      toggleDebtStatus: () => {},
    };
  }

  return context;
}





