export interface Bank {
  id: string;
  name: string;
  type: 'bumn' | 'swasta' | 'syariah' | 'digital' | 'cash';
  balance: number;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  bankId: string;
  bankName: string;
  date: Date;
  category: string;
}

export interface MoneyState {
  banks: Bank[];
  transactions: Transaction[];
  totalBalance: number;
}