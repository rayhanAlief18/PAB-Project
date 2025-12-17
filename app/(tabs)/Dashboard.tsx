import CardMoneyPlacing from '@/components/custom/Card/CardMoneyPlacing';
import HeaderDashboard from '@/components/custom/HeaderDashboard';
import MenuMoneyTrack from '@/components/custom/Menu/MenuMoneyTrack';
import RecentlyCashflow from '@/components/custom/RecentlyCashflow/RecentlyCashflow';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function TabTwoScreen() {
  return (

    <SafeAreaView className='flex-1 bg-[#F2F2F7] '>
      <HeaderDashboard name='Rayhan Alief Febryan' customClass={`px-[30px]`}/>
      <ScrollView className='-mb-[30px]'>
        <CardMoneyPlacing />
        <MenuMoneyTrack customClass={`px-[30px]`}/>
        <RecentlyCashflow customClass={`px-[30px]  mb-[80px]`}/>
      </ScrollView>
    </SafeAreaView>
  );
}


