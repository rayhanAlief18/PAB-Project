import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { uploadKotaOneByOne } from '../uploadKotaData';

export default function index() {
  const [uploading, setUploading] = useState<any>(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    Alert.alert(
      'Konfirmasi Upload',
      'Apakah Anda yakin ingin mengupload semua data kota ke Firestore?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Upload',
          onPress: async () => {
            setUploading(true);
            setResult(null);
            
            const uploadResult = await uploadKotaOneByOne();
            
            setUploading(false);
            setResult(uploadResult);
            
            if (uploadResult.success) {
              Alert.alert('Sukses!', `Berhasil upload ${uploadResult.count} data kota`);
            } else {
              Alert.alert('Error!', uploadResult.error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Data Kota ke Firestore</Text>
      
      <TouchableOpacity 
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Data</Text>
        )}
      </TouchableOpacity>
      
      {result && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, result.success ? styles.success : styles.error]}>
            {result.success 
              ? `✅ Berhasil upload ${result.count} data` 
              : `❌ Error: ${result.error}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  resultContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  resultText: {
    fontSize: 14,
    textAlign: 'center'
  },
  success: {
    color: '#28a745'
  },
  error: {
    color: '#dc3545'
  }
});