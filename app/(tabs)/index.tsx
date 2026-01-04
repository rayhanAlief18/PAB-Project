import CardMain from '@/components/custom/Card/CardMain';
import HeaderDashboard from '@/components/custom/HeaderDashboard';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchKota from '../../components/custom/SearchKota/index';
export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-[#F2F2F7]'>
      <ScrollView>
        <HeaderDashboard name={'Salahuddin Al Ayyubi'} customClass='px-[30px]' />
        {/* <FiturSholat /> */}
        {/* <CardMain customClass='px-[30px]'/> */}
        <SearchKota />
      </ScrollView>
    </SafeAreaView>
  );
}


