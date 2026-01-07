import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/Firebase';

export interface MoneyPlacement {
  id: string;
  name: string;
  type: 'bank' | 'e-wallet';
  nominal: number;
  createdAt: Date;
  updatedAt?: Date;
}

interface MoneyPlacingContextType {
  placements: MoneyPlacement[];
  addPlacement: (placement: Omit<MoneyPlacement, 'id' | 'createdAt'>) => Promise<void>;
  updatePlacement: (id: string, placement: Partial<MoneyPlacement>) => Promise<void>;
  deletePlacement: (id: string) => Promise<void>;
  getPlacements: () => Promise<void>;
  loading: boolean;
}

const MoneyPlacingContext = createContext<MoneyPlacingContextType | undefined>(undefined);

export const MoneyPlacingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [placements, setPlacements] = useState<MoneyPlacement[]>([]);
  const [loading, setLoading] = useState(false);

  // Simpan ke AsyncStorage sebagai cache
  const saveToStorage = async (data: MoneyPlacement[]) => {
    try {
      await AsyncStorage.setItem('moneyPlacements', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  // Ambil dari AsyncStorage
  const getFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('moneyPlacements');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting from storage:', error);
      return [];
    }
  };

  // Sync dengan Firestore
  const syncWithFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'moneyPlacements'));
      const firestoreData: MoneyPlacement[] = [];
      
      querySnapshot.forEach((doc) => {
        firestoreData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as MoneyPlacement);
      });

      // Update storage dengan data terbaru
      await saveToStorage(firestoreData);
      setPlacements(firestoreData);
    } catch (error) {
      console.error('Error syncing with Firestore:', error);
      
      // Fallback ke storage lokal
      const storedData = await getFromStorage();
      setPlacements(storedData);
    }
  };

  const getPlacements = async () => {
    setLoading(true);
    await syncWithFirestore();
    setLoading(false);
  };

  const addPlacement = async (placementData: Omit<MoneyPlacement, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newPlacement: Omit<MoneyPlacement, 'id'> = {
        ...placementData,
        createdAt: new Date(),
      };

      // Simpan ke Firestore
      const docRef = await addDoc(collection(db, 'moneyPlacements'), newPlacement);
      
      const placementWithId: MoneyPlacement = {
        ...newPlacement,
        id: docRef.id,
      };

      // Update state dan storage
      const updatedPlacements = [...placements, placementWithId];
      setPlacements(updatedPlacements);
      await saveToStorage(updatedPlacements);
    } catch (error) {
      console.error('Error adding placement:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePlacement = async (id: string, updates: Partial<MoneyPlacement>) => {
    setLoading(true);
    try {
      // Update di Firestore
      await updateDoc(doc(db, 'moneyPlacements', id), {
        ...updates,
        updatedAt: new Date(),
      });

      // Update state dan storage
      const updatedPlacements = placements.map(placement =>
        placement.id === id 
          ? { ...placement, ...updates, updatedAt: new Date() }
          : placement
      );
      
      setPlacements(updatedPlacements);
      await saveToStorage(updatedPlacements);
    } catch (error) {
      console.error('Error updating placement:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePlacement = async (id: string) => {
    setLoading(true);
    try {
      // Hapus dari Firestore
      await deleteDoc(doc(db, 'moneyPlacements', id));

      // Update state dan storage
      const updatedPlacements = placements.filter(placement => placement.id !== id);
      setPlacements(updatedPlacements);
      await saveToStorage(updatedPlacements);
    } catch (error) {
      console.error('Error deleting placement:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     getPlacements();
//   }, []);

  return (
    <MoneyPlacingContext.Provider
      value={{
        placements,
        addPlacement,
        updatePlacement,
        deletePlacement,
        getPlacements,
        loading,
      }}
    >
      {children}
    </MoneyPlacingContext.Provider>
  );
};

export const useMoneyPlacing = () => {
  const context = useContext(MoneyPlacingContext);

  if (!context) {
    console.error(
      'useMoneyPlacing dipakai di luar MoneyPlacingProvider'
    );

    return {
      placements: [],
      addPlacement: async () => {},
      updatePlacement: async () => {},
      deletePlacement: async () => {},
      getPlacements: async () => {},
      loading: false,
    };
  }

  return context;
};