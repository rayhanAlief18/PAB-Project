import { Header } from '@/components/custom';
import RecentlyCashflow from '@/components/custom/RecentlyCashflow/RecentlyCashflow';
import CardMoneyPlacing from '@/components/custom/Card/CardMoneyPlacing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import MenuToDoList from '@/components/custom/Menu/MenuToDoList';
import CardGroupTask from '@/components/custom/Card/CardGroupTask';
export default function TabTwoScreen() {
  return (

    <SafeAreaView className='flex-1 bg-[#F2F2F7] '>
      <Header name='Rayhan Alief Febryan' customClass={`px-[30px]`}/>
      <ScrollView className='-mb-[30px]'>
        <MenuToDoList customClass={`px-[30px]`}/>
        <CardGroupTask />
        <RecentlyCashflow customClass={`px-[30px]`}/>
      </ScrollView>
    </SafeAreaView>
  );
}


