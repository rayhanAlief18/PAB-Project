import { Header } from '@/components/custom';
import CardGroupTask from '@/components/custom/Card/CardGroupTask';
import MenuToDoList from '@/components/custom/Menu/MenuToDoList';
import TaskHariIni from '@/components/custom/ToDo/TaskHariIni';
import TaskSummary from '@/components/custom/ToDo/TaskSummary';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function TabTwoScreen() {
  return (

    <SafeAreaView className='flex-1 bg-[#F2F2F7] pb-[-20px]'>
      <Header name='Azhim' customClass={'px-[30px]'} />
      <ScrollView className='-mb-[30px]'>
        <MenuToDoList customClass={'px-[30px] mt-[12px]'} />
        <CardGroupTask />
        <TaskSummary customClass='px-[30px] mt-[20px]' />
        <TaskHariIni customClass='px-[30px] mt-[20px]' />
      </ScrollView>
    </SafeAreaView>
  );
}