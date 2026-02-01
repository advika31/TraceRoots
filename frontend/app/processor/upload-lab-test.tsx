import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ProcessorAPI } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function UploadLabTest() {
  const router = useRouter();
  const { batchId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!result || !image) {
      Alert.alert("Missing Info", "Please enter result summary and attach report image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('result_summary', result);
      formData.append('processor_id', '101'); // Mock ID
      
      const filename = image.split('/').pop() || "report.jpg";
      // @ts-ignore
      formData.append('file', { uri: image, name: filename, type: 'image/jpeg' });

      await ProcessorAPI.uploadReport(batchId as string, formData);
      
      Alert.alert("Success", "Batch Certified & Status Updated!");
      router.replace('/processor/processor_dashboard');

    } catch (e) {
      Alert.alert("Error", "Upload failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certify Batch #{batchId}</Text>
      <Text style={styles.subtitle}>Attach Quality Control Report</Text>

      {/* Result Input */}
      <Text style={styles.label}>Result Summary</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Grade A - Organic Certified" 
        value={result}
        onChangeText={setResult}
      />

      {/* Image Upload */}
      <Text style={styles.label}>Attach Report Image</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="cloud-upload-outline" size={40} color="#666" />
            <Text style={{color: '#666', marginTop: 10}}>Tap to Select File</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity 
        style={[styles.btn, loading && styles.disabledBtn]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit Certification</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 25 },
  uploadBox: { height: 200, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 15, overflow: 'hidden', marginBottom: 30 },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  image: { width: '100%', height: '100%' },
  btn: { backgroundColor: '#2e7d32', padding: 18, borderRadius: 12, alignItems: 'center' },
  disabledBtn: { backgroundColor: '#a5d6a7' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});