// frontend/app/collector/new-collection.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { CollectorAPI } from '../../services/api';

export default function NewCollection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [locationCoords, setLocationCoords] = useState('0.0,0.0');
  const [address, setAddress] = useState('Fetching location...');

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAddress('Location permission denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          // timeout: 5000 
        });
        
        setLocationCoords(`${location.coords.latitude},${location.coords.longitude}`);
        setAddress(`Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
      
      } catch (e) {
        console.log("GPS Failed, using default");
        setLocationCoords("28.6139,77.2090"); 
        setAddress("GPS Unavailable (Using Default)");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !cropName || !quantity) {
      Alert.alert("Missing Details", "Please take a photo and fill all fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Get User ID from storage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error("User not logged in");

      // 2. Prepare Form Data
      const formData = new FormData();
      formData.append('farmer_id', userId);
      formData.append('crop_name', cropName);
      formData.append('quantity', quantity);
      formData.append('location', locationCoords);

      const filename = image.split('/').pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore
      formData.append('file', { uri: image, name: filename, type });

      // 3. Send to Backend
      const result = await CollectorAPI.uploadBatch(formData);
      
      Alert.alert("Success!", "Batch created successfully.");
      router.replace('/collector/collector_dashboard');

    } catch (error) {
      console.error(error);
      Alert.alert("Upload Failed", "Could not connect to server. Check internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Harvest Collection 🌱</Text>

      {/* Camera Section */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={50} color="#666" />
            <Text style={styles.placeholderText}>Tap to Take Photo of Crop</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Form Section */}
      <View style={styles.form}>
        <Text style={styles.label}>Crop Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Wheat, Tomato" 
          value={cropName}
          onChangeText={setCropName}
        />

        <Text style={styles.label}>Quantity (kg)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 500" 
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Location (Auto-detected)</Text>
        <View style={styles.locationBox}>
          <Ionicons name="location-sharp" size={20} color="#2e7d32" />
          <Text style={styles.locationText}>{address}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Generate Batch ID</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20, marginTop: 10 },
  imageContainer: { height: 200, backgroundColor: '#e0e0e0', borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 10, color: '#666' },
  form: { gap: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  locationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 15, borderRadius: 10 },
  locationText: { marginLeft: 10, color: '#2e7d32', fontWeight: '500' },
  btn: { backgroundColor: '#2e7d32', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnDisabled: { backgroundColor: '#a5d6a7' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});