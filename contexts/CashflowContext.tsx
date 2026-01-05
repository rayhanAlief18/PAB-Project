import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/Firebase';
import { useMoneyPlacing } from './MoneyPlacingContext';

export interface Cashflow {
  id: string;
  moneyPlacementId: string;
  moneyPlacementName: string;
  category: string;
  condition: 'tambah' | 'kurang';
  nominal: number;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface CashflowContextType {
  cashflows: Cashflow[];
  addCashflow: (cashflow: Omit<Cashflow, 'id' | 'createdAt'>) => Promise<void>;
  updateCashflow: (id: string, cashflow: Partial<Cashflow>) => Promise<void>;
  deleteCashflow: (id: string, revertMoneyPlacing?: boolean) => Promise<void>;
  getCashflows: () => Promise<void>;
  loading: boolean;
}

const CashflowContext = createContext<CashflowContextType | undefined>(undefined);

// Kategori yang tersedia
export const CATEGORIES = [
  'Makan/Minum',
  'Bensin',
  'Pendapatan',
  'Gaji',
  'Investasi',
  'Jajan',
  'Online Shop',
  'Transportasi',
  'Hiburan',
  'Kesehatan',
  'Pendidikan',
  'Tagihan',
  'Lain-lain'
];

export const CashflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cashflows, setCashflows] = useState<Cashflow[]>([]);
  const [loading, setLoading] = useState(false);
  const { placements, updatePlacement } = useMoneyPlacing();

  // Simpan ke AsyncStorage sebagai cache
  const saveToStorage = async (data: Cashflow[]) => {
    try {
      await AsyncStorage.setItem('cashflows', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cashflows to storage:', error);
    }
  };

  // Ambil dari AsyncStorage
  const getFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('cashflows');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting cashflows from storage:', error);
      return [];
    }
  };

  // Sync dengan Firestore
  const syncWithFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cashflows'));
      const firestoreData: Cashflow[] = [];
      
      querySnapshot.forEach((doc) => {
        firestoreData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as Cashflow);
      });

      // Update storage dengan data terbaru
      await saveToStorage(firestoreData);
      setCashflows(firestoreData);
    } catch (error) {
      console.error('Error syncing cashflows with Firestore:', error);
      
      // Fallback ke storage lokal
      const storedData = await getFromStorage();
      setCashflows(storedData);
    }
  };

  // Update nominal Money Placement
  const updateMoneyPlacementNominal = async (
    moneyPlacementId: string, 
    condition: 'tambah' | 'kurang', 
    nominal: number,
    isRevert: boolean = false
  ) => {
    try {
      const placement = placements.find(p => p.id === moneyPlacementId);
      if (!placement) {
        throw new Error('Money Placement not found');
      }

      let newNominal = placement.nominal;
      
      if (isRevert) {
        // Jika revert, balikkan operasi
        newNominal = condition === 'tambah' 
          ? placement.nominal - nominal 
          : placement.nominal + nominal;
      } else {
        // Operasi normal
        newNominal = condition === 'tambah' 
          ? placement.nominal + nominal 
          : placement.nominal - nominal;
      }

      // Pastikan nominal tidak negatif
      if (newNominal < 0) {
        throw new Error('Nominal cannot be negative');
      }

      await updatePlacement(moneyPlacementId, { nominal: newNominal });
    } catch (error) {
      console.error('Error updating money placement:', error);
      throw error;
    }
  };

  const getCashflows = async () => {
    setLoading(true);
    await syncWithFirestore();
    setLoading(false);
  };

  const addCashflow = async (cashflowData: Omit<Cashflow, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Validasi nominal tidak negatif
      if (cashflowData.nominal <= 0) {
        throw new Error('Nominal harus lebih dari 0');
      }

      // Update Money Placement terlebih dahulu
      await updateMoneyPlacementNominal(
        cashflowData.moneyPlacementId,
        cashflowData.condition,
        cashflowData.nominal
      );

      // Simpan cashflow ke Firestore
      const newCashflow: Omit<Cashflow, 'id'> = {
        ...cashflowData,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'cashflows'), newCashflow);
      
      const cashflowWithId: Cashflow = {
        ...newCashflow,
        id: docRef.id,
      };

      // Update state dan storage
      const updatedCashflows = [...cashflows, cashflowWithId];
      setCashflows(updatedCashflows);
      await saveToStorage(updatedCashflows);
    } catch (error) {
      console.error('Error adding cashflow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCashflow = async (id: string, updates: Partial<Cashflow>) => {
    setLoading(true);
    try {
      // Cari cashflow lama untuk revert
      const oldCashflow = cashflows.find(c => c.id === id);
      if (!oldCashflow) {
        throw new Error('Cashflow not found');
      }

      // Revert perubahan lama
      await updateMoneyPlacementNominal(
        oldCashflow.moneyPlacementId,
        oldCashflow.condition,
        oldCashflow.nominal,
        true // revert
      );

      // Apply perubahan baru
      if (updates.nominal && updates.condition) {
        await updateMoneyPlacementNominal(
          oldCashflow.moneyPlacementId,
          updates.condition,
          updates.nominal
        );
      }

      // Update di Firestore
      const updatedData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await updateDoc(doc(db, 'cashflows', id), updatedData);

      // Update state dan storage
      const updatedCashflows = cashflows.map(cashflow =>
        cashflow.id === id 
          ? { ...cashflow, ...updatedData, updatedAt: new Date() }
          : cashflow
      );
      
      setCashflows(updatedCashflows);
      await saveToStorage(updatedCashflows);
    } catch (error) {
      console.error('Error updating cashflow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCashflow = async (id: string, revertMoneyPlacing: boolean = true) => {
    setLoading(true);
    try {
      const cashflowToDelete = cashflows.find(c => c.id === id);
      if (!cashflowToDelete) {
        throw new Error('Cashflow not found');
      }

      // Revert perubahan di Money Placement jika diperlukan
      if (revertMoneyPlacing) {
        await updateMoneyPlacementNominal(
          cashflowToDelete.moneyPlacementId,
          cashflowToDelete.condition,
          cashflowToDelete.nominal,
          true // revert
        );
      }

      // Hapus dari Firestore
      await deleteDoc(doc(db, 'cashflows', id));

      // Update state dan storage
      const updatedCashflows = cashflows.filter(cashflow => cashflow.id !== id);
      setCashflows(updatedCashflows);
      await saveToStorage(updatedCashflows);
    } catch (error) {
      console.error('Error deleting cashflow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     getCashflows();
//   }, []);

  return (
    <CashflowContext.Provider
      value={{
        cashflows,
        addCashflow,
        updateCashflow,
        deleteCashflow,
        getCashflows,
        loading,
      }}
    >
      {children}
    </CashflowContext.Provider>
  );
};

export const useCashflow = () => {
  const context = useContext(CashflowContext);

  if (!context) {
    console.error(
      'useCashflow dipakai di luar CashflowProvider'
    );

    return {
      cashflows: [],
      addCashflow: async () => {},
      updateCashflow: async () => {},
      deleteCashflow: async () => {},
      getCashflows: async () => {},
      loading: false,
    };
  }

  return context;
};
