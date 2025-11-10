import { Header } from '@/components/custom';
import MenuMoneyTrack from '@/components/custom/Menu/MenuMoneyTrack';
import RecentlyCashflow from '@/components/custom/RecentlyCashflow/RecentlyCashflow';
import CardMoneyPlacing from '@/components/custom/Card/CardMoneyPlacing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
export default function TabTwoScreen() {
  return (

    <SafeAreaView className='flex-1 bg-[#F2F2F7] '>
      <Header name='Rayhan Alief Febryan' customClass={`px-[30px]`}/>
      <ScrollView className='-mb-[30px]'>
        <CardMoneyPlacing />
        <MenuMoneyTrack customClass={`px-[30px]`}/>
        <RecentlyCashflow customClass={`px-[30px]`}/>
      </ScrollView>
    </SafeAreaView>
  );
}


