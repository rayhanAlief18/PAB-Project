import { Box } from '@/components/ui/box'
import { Button, ButtonIcon } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { db } from '@/config/Firebase'
import axios from 'axios'
import { collection, getDocs } from 'firebase/firestore'
import { Globe2Icon, LucideMapPinHouse, Search, SearchIcon, X } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Cuaca from '../Cuaca/index'
import FormInputs from '../Input/FormInput'
import JadwalSholat from '../JadwalSholat/index'

export default function index() {
    const [search, setSearch] = useState('');
    const [isView, setIsView] = useState(false);
    const [selectCity, setSelectCity] = useState({
        id: '',
        lokasi: '',
        name: '',
    });
    const API_KEY = "8a12536d8bd199b35f74b66937dabca7";
    const [showJamSholat, setShowJamSholat] = useState(true)
    const [jamSholat, setJamSholat] = useState({
        imsak: "",
        subuh: "",
        dhuha: "",
        dzuhur: "",
        ashar: "",
        maghrib: "",
        isya: "",
        tanggal: "",
        lokasi: "",
    })

    const searchKota = async () => {
        const getData = await getDocs(collection(db, 'kota'))
        return getData.docs.map((doc => ({
            id: doc.id,
            ...doc.data()
        })))
    }

    const normalisasi = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/\./g, '')
            .replace(/kab|kota/g, '')
            .trim()
    }

    const filterKota = (kota: any[], keyword: string) => {
        if (!keyword) return [];
        const normalized = normalisasi(keyword);

        return kota.filter(city => {
            return normalisasi(city.lokasi ?? '').includes(normalized);
        })
    }

    const [city, setCity] = useState<any[]>([])
    const [results, setResults] = useState<any[]>([])

    useEffect(() => {
        searchKota().then(setCity)
        // console.log("use 1 kota:", city);
    }, [])

    useEffect(() => {
        setResults(filterKota(city, search))
        // console.log("use 2 result", results);
    }, [search, city])

    const pickCity = async (id: string, lokasi: string, name: string) => {
        setSelectCity({
            id,
            lokasi,
            name,
        })
        // console.log("selected city", selectCity);
        setIsView(false)
        setJadwalSholat(id, lokasi);
        fetchWeather(name);
    }


    const setJadwalSholat = async (id: string, lokasi: string) => {
        const res = await axios.get(
            `https://api.myquran.com/v3/sholat/jadwal/${id}/today`,
            { params: { tz: 'Asia/Jakarta' } }
        )

        // console.log("res.data.data: ", res.data.data);
        // console.log("res.kota: ", res.data.data.kabko);
        const response = res.data.data;
        const daerah = res.data.data.kabko;
        const tanggalKey = Object.keys(response.jadwal)[0]
        const jadwal = response.jadwal[tanggalKey]
        setJamSholat({
            imsak: jadwal.imsak,
            subuh: jadwal.subuh,
            dhuha: jadwal.dhuha,
            dzuhur: jadwal.dzuhur,
            ashar: jadwal.ashar,
            maghrib: jadwal.maghrib,
            isya: jadwal.isya,
            tanggal: jadwal.tanggal,
            lokasi: daerah,
        })
        setShowJamSholat(true)
        // console.log("JAMSHOLAT: ", jamSholat)
    }
    const [allWeather, setAllWeather] = useState({});
    const [weather, setWeather] = useState({
        wind: 0,
        cloud: 0,
        temperature: 0,
        temperature_min: 0,
        temperature_max: 0,
        sunrise: 0,
        sunset: 0,
    });
    const fetchWeather = async (cityName: string) => {
        try {
            const res = await axios.get(
                'https://api.openweathermap.org/data/2.5/weather',
                {
                    params: {
                        q: `${cityName}`,
                        appid: API_KEY,
                        units: 'metric',
                        lang: 'id',
                    },
                }
            )
            setAllWeather(res.data)
            setWeather({
                wind: res.data.wind.speed,
                cloud: res.data.clouds.all,
                temperature: res.data.main.temp,
                temperature_min: res.data.main.temp_min,
                temperature_max: res.data.main.temp_max,
                sunrise: res.data.sys.sunrise,
                sunset: res.data.sys.sunset,
            })


            // console.log('data ori res:', res)
            // console.log('data ori res.data:', JSON.stringify(res.data, null, 2))
            console.log('data dari API:', weather)
            // console.log("ini data cuaca", cityName);
        } catch (error) {
            console.log('Gagal ambil cuaca:', error)
        }
    }
    return (
        <>
            <View>
                <HStack className='gap-2 items-end justify-center z-[2]'>
                    <View className='w-[70%]'>
                        <TouchableOpacity
                            onPress={() => { setIsView(true) }}
                        >
                            <FormInputs
                                title=''
                                value={search}
                                setOnChange={setSearch}
                                placeholder="Masukan nama wilayah..."
                                isPassword={false}
                                isRequired={true}
                                typeInput='default'
                                variant='rounded'
                                icon={Globe2Icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <Button
                        onPress={() => { setIsView(true) }}
                        size="lg"
                        className="rounded-full bg-gray-800 p-3.5">
                        <ButtonIcon as={Search} color='white' />
                    </Button>
                </HStack>

                {/* ini modal custom */}
                {isView && (
                    <View className='px-[30px] z-50 absolute top-[74px] w-full'>
                        <Box className='border border-gray-400 rounded-lg bg-white p-3'>
                            <HStack className='border-b border-gray-400 justify-between'>
                                <HStack className='items-center gap-2 pb-2 '>
                                    <SearchIcon color={"#2d3748"} />
                                    <Text className='text-md text-gray-800' style={{ fontFamily: "HankenGrotesk_500Medium" }}>{search}</Text>
                                </HStack>
                                <TouchableOpacity
                                    onPress={() => setIsView(false)}
                                >
                                    <X color={"#4A5568"} />
                                </TouchableOpacity>
                            </HStack>

                            <View className="max-h-[200px]" style={{ maxHeight: 200 }}>
                                <ScrollView
                                    showsVerticalScrollIndicator
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <VStack>
                                        {results.map(item => (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => pickCity(item.id, item.lokasi, item.name)}
                                            >
                                                <HStack
                                                    className='items-center gap-2 border-b border-gray-400 pb-2 mt-4'
                                                >
                                                    <LucideMapPinHouse color={"#4A5568"} />
                                                    <VStack>
                                                        <Text>{item.lokasi}</Text>
                                                        <Text className='text-xs text-gray-500'>
                                                            {item.name}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </TouchableOpacity>
                                        ))}
                                    </VStack>
                                </ScrollView>
                            </View>
                        </Box>
                    </View>
                )}
            </View>


            {/* Cuaca */}
            <View>
                {showJamSholat && Object.keys(allWeather).length > 0 && (
                    <Cuaca weather={weather} />
                )}
            </View>

            {/* Jadwal Sholat */}
            <View className='px-[30px] mt-4'>
                {showJamSholat && jamSholat.subuh && (
                    <JadwalSholat dataJamSholat={jamSholat} />
                )}
            </View>

            {!showJamSholat == false &&(
                <VStack className='h-full justify-end'>
                    <Text className='text-center align-center'>Data belum dimuat,</Text>
                    <Text className='text-center align-center'> silahkan cari terlebih dahulu...</Text>
                </VStack>
            )}
        </>
    )
}
