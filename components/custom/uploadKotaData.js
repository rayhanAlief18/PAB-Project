import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import kotaData from '../../kota.json'; // Sesuaikan path file JSON Anda
import { db } from '../../config/Firebase/index';

/**
 * Upload data kota ke Firestore
 * Menggunakan batch write untuk efisiensi
 */
export const uploadKotaToFirestore = async() => {
    try {
        console.log('Mulai upload data ke Firestore...');

        const batch = writeBatch(db);
        const kotaCollection = collection(db, 'Kota');

        // Firestore batch memiliki limit 500 operasi per batch
        // Jadi kita perlu split jika data lebih dari 500
        const BATCH_SIZE = 500;
        let batchCount = 0;
        let currentBatch = writeBatch(db);

        for (let i = 0; i < kotaData.data.length; i++) {
            const item = kotaData.data[i];

            // Buat document reference dengan ID dari data
            const docRef = doc(kotaCollection, item.id);

            // Tambahkan ke batch
            currentBatch.set(docRef, {
                id: item.id,
                lokasi: item.lokasi,
                name: item.name,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            batchCount++;

            // Jika sudah 500 dokumen, commit batch dan buat batch baru
            if (batchCount === BATCH_SIZE) {
                console.log(`Committing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
                await currentBatch.commit();
                currentBatch = writeBatch(db);
                batchCount = 0;
            }
        }

        // Commit sisa batch terakhir
        if (batchCount > 0) {
            console.log('Committing final batch...');
            await currentBatch.commit();
        }

        console.log(`✅ Berhasil upload ${kotaData.data.length} data kota ke Firestore!`);
        return { success: true, count: kotaData.data.length };

    } catch (error) {
        console.error('❌ Error uploading data:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Upload data satu per satu (alternatif, lebih lambat)
 */
export const uploadKotaOneByOne = async() => {
    try {
        console.log('Mulai upload data ke Firestore (one by one)...');

        const kotaCollection = collection(db, 'kota');
        let successCount = 0;

        for (const item of kotaData.data) {
            try {
                await setDoc(doc(kotaCollection, item.id), {
                    id: item.id,
                    lokasi: item.lokasi,
                    name: item.name,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                successCount++;

                if (successCount % 50 === 0) {
                    console.log(`Uploaded ${successCount}/${kotaData.data.length} documents...`);
                }
            } catch (docError) {
                console.error(`Error uploading document ${item.id}:`, docError);
            }
        }

        console.log(`✅ Berhasil upload ${successCount} data kota ke Firestore!`);
        return { success: true, count: successCount };

    } catch (error) {
        console.error('❌ Error uploading data:', error);
        return { success: false, error: error.message };
    }
};