// frontend/app/collector/surplus-redistribution.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CollectorAPI, SurplusAPI } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function SurplusRedistribution() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<any[]>([]);
  const [donatingId, setDonatingId] = useState<string | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const data = await CollectorAPI.getHistory(Number(userId));
      
      const donationCandidates = data.filter((b: any) => 
        b.status !== 'SOLD' && b.status !== 'DONATION_READY' && b.status !== 'DISTRIBUTED'
      );
      setBatches(donationCandidates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (batchId: string) => {
    setDonatingId(batchId);
    try {
      // 1. Call API
      const response = await SurplusAPI.donateBatch(batchId);
      
      // 2. Success Alert
      Alert.alert(
        "Impact Created! 🌍",
        `You earned +${response.impact_tokens_earned} Impact Tokens.\nNGOs have been notified.`,
        [{ text: "Awesome", onPress: () => loadBatches() }]
      );
    } catch (e) {
      Alert.alert("Error", "Could not process donation.");
    } finally {
      setDonatingId(null);
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

      <TouchableOpacity 
        style={styles.donateBtn} 
        onPress={() => handleDonate(item.batch_id)}
        disabled={donatingId === item.batch_id}
      >
        {donatingId === item.batch_id ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="gift-outline" size={20} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.btnText}>Donate & Earn Tokens</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#333" onPress={() => router.back()} />
        <Text style={styles.title}>Surplus Management</Text>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Reduce Waste. Earn Rewards.</Text>
        <Text style={styles.bannerDesc}>Donate unsold crops to local NGOs. Verified by Blockchain.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{marginTop: 50}} />
      ) : batches.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="basket-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No eligible batches found.</Text>
        </View>
      ) : (
        <FlatList 
          data={batches}
          keyExtractor={(item) => item.batch_id}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  banner: { backgroundColor: '#e8f5e9', padding: 20, borderRadius: 15, marginBottom: 20 },
  bannerTitle: { color: '#2e7d32', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  bannerDesc: { color: '#555' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  cropName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qty: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  date: { color: '#888', marginBottom: 2 },
  status: { color: '#666', marginBottom: 15 },
  donateBtn: { backgroundColor: '#fbc02d', flexDirection: 'row', justifyContent: 'center', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  empty: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 }
});