import { Header } from '@/components/custom';
import CardMain from '@/components/custom/Card/CardMain';
import PieChartDashboard from '@/components/custom/Chart/PieChartDashboard';
import TaskSummary from '@/components/custom/ToDo/TaskSummary';
import { Divider } from '@/components/ui/divider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <Header name='Azhim'customClass='px-[30px]'/>
      <CardMain customClass='px-[30px]'/>
      <PieChartDashboard customClass='my-[30px] px-[30px]'/>
      <TaskSummary customClass='px-[30px]'/>
    </SafeAreaView>
  );
}


