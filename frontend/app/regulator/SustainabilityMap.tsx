// frontend/app/regulator/SustainabilityMap.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RegulatorAPI } from '../../services/api';

export default function SustainabilityMap() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await RegulatorAPI.getMapData();
    setMapData(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sustainability Tracker 🌍</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Real-time Crop Stress Analysis</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" style={{marginTop: 50}} />
        ) : (
          <View style={styles.grid}>
            {mapData.length === 0 ? (
                <Text style={styles.empty}>No active harvests to analyze.</Text>
            ) : (
                mapData.map((point, index) => (
                <View key={index} style={[styles.card, point.zone_status === 'RED' ? styles.cardRed : styles.cardGreen]}>
                    <View style={styles.cardHeader}>
                        <Ionicons 
                            name={point.zone_status === 'RED' ? "alert-circle" : "checkmark-circle"} 
                            size={24} 
                            color={point.zone_status === 'RED' ? "#c62828" : "#2e7d32"} 
                        />
                        <Text style={styles.zoneText}>{point.zone_status === 'RED' ? "STRESSED ZONE" : "SAFE ZONE"}</Text>
                    </View>
                    
                    <Text style={styles.crop}>{point.crop}</Text>
                    <Text style={styles.detail}>Farmer: {point.farmer}</Text>
                    <Text style={styles.detail}>Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}</Text>
                    
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>Stress Score: {point.stress_score}</Text>
                    </View>
                </View>
                ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, color: '#1b5e20' },
  content: { padding: 20 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  grid: { gap: 15 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  card: { padding: 15, borderRadius: 12, borderWidth: 1, elevation: 1 },
  cardGreen: { backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' },
  cardRed: { backgroundColor: '#ffebee', borderColor: '#ffcdd2' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  zoneText: { fontWeight: 'bold', marginLeft: 8, fontSize: 14, color: '#555' },
  crop: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  detail: { fontSize: 14, color: '#666', marginBottom: 2 },
  scoreBadge: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontSize: 12, fontWeight: '600', color: '#333' }
});