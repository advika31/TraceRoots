import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SurplusAPI } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function NGODashboard() {
  const [donations, setDonations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const data = await SurplusAPI.getAvailable();
      setDonations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClaim = async (batchId: string) => {
    try {
      await SurplusAPI.claimBatch(batchId, 501); // Mock NGO ID 501
      Alert.alert("Success", "You have claimed this donation!");
      loadDonations();
    } catch (e) {
      Alert.alert("Error", "Claim failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NGO Food Rescue 🚚</Text>
      
      <FlatList
        data={donations}
        keyExtractor={item => item.batch_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {setRefreshing(true); loadDonations();}} />}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50, color: '#888'}}>No donations available right now.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.crop_name}</Text>
              <Text style={styles.qty}>{item.quantity} kg • {item.region || "Local Farm"}</Text>
            </View>
            <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(item.batch_id)}>
              <Text style={styles.btnText}>Claim</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1565c0' },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  qty: { color: '#666' },
  claimBtn: { backgroundColor: '#1565c0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});