import CardMain from '@/components/custom/Card/CardMain';
import PieChartDashboard from '@/components/custom/Chart/PieChartDashboard';
import HeaderDashboard from '@/components/custom/HeaderDashboard';
import TaskSummary from '@/components/custom/ToDo/TaskSummary';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <ScrollView>
        <HeaderDashboard name={'Rayhan Alief F'} customClass='px-[30px]' />
        <CardMain customClass='px-[30px]' />
        <PieChartDashboard customClass='my-[30px] px-[30px]' />
        <TaskSummary customClass='px-[30px]' />
      </ScrollView>
    </SafeAreaView>
  );
}


