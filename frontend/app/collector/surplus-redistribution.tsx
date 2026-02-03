import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CollectorAPI, SurplusAPI } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function SurplusRedistribution() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const data = await CollectorAPI.getHistory(Number(userId));
      setBatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await SurplusAPI.scanExpiring();
      await loadBatches();
    } finally {
      setScanning(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cropName}>{item.crop_name}</Text>
        <Text style={styles.qty}>{item.quantity} kg</Text>
      </View>
      <Text style={styles.date}>Harvested: {new Date(item.harvest_date).toLocaleDateString()}</Text>
      <Text style={styles.status}>Current Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#333" onPress={() => router.back()} />
        <Text style={styles.title}>Surplus Monitoring</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>System-Triggered Donations</Text>
        <Text style={styles.bannerDesc}>Batches nearing expiry are auto-flagged and NGOs are alerted.</Text>
      </View>

      <TouchableOpacity style={styles.scanBtn} onPress={handleScan} disabled={scanning}>
        {scanning ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Scan for Expiring Batches</Text>}
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 50 }} />
      ) : batches.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="basket-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No batches found.</Text>
        </View>
      ) : (
        <FlatList
          data={batches}
          keyExtractor={(item) => item.batch_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  banner: { backgroundColor: '#e8f5e9', padding: 20, borderRadius: 15, marginBottom: 12 },
  bannerTitle: { color: '#2e7d32', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  bannerDesc: { color: '#555' },
  scanBtn: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cropName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qty: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  date: { color: '#888', marginBottom: 2 },
  status: { color: '#666' },
  empty: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});
