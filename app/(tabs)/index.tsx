import CardMain from '@/components/custom/Card/CardMain';
import HeaderDashboard from '@/components/custom/HeaderDashboard';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchKota from '../../components/custom/SearchKota/index';

import { useEffect,useState } from 'react';
import { auth } from '../../config/Firebase/index'
import { onAuthStateChanged } from 'firebase/auth';


export default function HomeScreen() {
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
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <ScrollView>
        <HeaderDashboard name={name} customClass='px-[30px]' />
        <CardMain customClass='px-[30px]'/>
        <SearchKota />
      </ScrollView>
    </SafeAreaView>
  );
}


