import HeaderDashboard from '@/components/custom/HeaderDashboard';
import { Header } from '@/components/custom';
import CardGroupTask from '@/components/custom/Card/CardGroupTask';
import TodayTask from '@/components/custom/Card/TodayTask';
import MenuToDoList from '@/components/custom/Menu/MenuToDoList';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskSummary from '@/components/custom/ToDo/TaskSummary';
import TaskHariIni from '@/components/custom/ToDo/TaskHariIni';

import { useEffect,useState } from 'react';
import { auth } from '../../config/Firebase/index'
import { onAuthStateChanged } from 'firebase/auth';


export default function TabTwoScreen() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged mengembalikan fungsi unsubscribe
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ambil displayName dari object user Firebase
        setName(user.displayName || "User Tanpa Nama");
      } else {
        setName("Tamu");
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup saat komponen tidak dipakai
  }, []);

  if (loading) {
    return <ActivityIndicator />; // Tampilkan loading saat cek auth
  }
  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7] pb-[-20px]'>
      <HeaderDashboard name={name} customClass={`px-[30px]`} />
      <ScrollView className=''>
        <MenuToDoList customClass={`px-[30px] mt-[12px]`} />
        <CardGroupTask />
        <TaskSummary customClass='px-[30px] mt-[20px]' />
        <TaskHariIni customClass='px-[30px] mt-[20px]' />
      </ScrollView>
    </SafeAreaView>
  );
}