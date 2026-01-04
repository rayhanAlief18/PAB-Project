import React from 'react';
import { Text, View } from 'react-native';

interface JamSholatProps {
    imsak: string;
    subuh: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
    tanggal: string;
}

interface JadwalSholatProps {
    dataJamSholat: JamSholatProps;
}

interface WaktuSholatItem {
    nama: string;
    waktu: string;
}

export default function JadwalSholat({ dataJamSholat }: JadwalSholatProps) {
    const { imsak, subuh, dhuha, dzuhur, ashar, maghrib, isya, tanggal } = dataJamSholat;

    const waktuSholat: WaktuSholatItem[] = [
        { nama: 'Imsak', waktu: imsak },
        { nama: 'Subuh', waktu: subuh },
        { nama: 'Dhuha', waktu: dhuha },
        { nama: 'Dzuhur', waktu: dzuhur },
        { nama: 'Ashar', waktu: ashar },
        { nama: 'Maghrib', waktu: maghrib },
        { nama: 'Isya', waktu: isya },
    ];

    const formatWaktu = (waktu: string): string => {
        return waktu ? `${waktu} WIB` : '--:--';
    };

    return (
        <View className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {/* Header */}
            <View className="bg-gray-800 px-6 py-4">
                <View className="flex-row justify-between items-center">
                    <Text className="text-white text-lg font-bold">Jadwal Sholat</Text>
                    <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <Text className="text-white text-sm font-semibold">{tanggal || '--:--'}</Text>
                    </View>
                </View>
            </View>

            {/* Daftar Waktu Sholat */}
            <View className="p-4">
                {waktuSholat.map((item, index) => (
                    <View
                        key={item.nama}
                        className={`
              flex-row justify-between items-center 
              bg-gray-50 px-5 py-4 rounded-xl
              ${index !== waktuSholat.length - 1 ? 'mb-3' : ''}
            `}
                    >
                        <Text className="text-gray-800 text-base font-semibold">
                            {item.nama}
                        </Text>
                        <Text className="text-gray-600 text-base font-medium">
                            {formatWaktu(item.waktu)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}