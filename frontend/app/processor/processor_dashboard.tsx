import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import api from '../../services/api';

export default function ProcessorDashboard() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [certifiedCount, setCertifiedCount] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);

  const loadStats = async () => {
    const res = await api.get('/batches/all');
    const batches = Array.isArray(res.data) ? res.data : [];
    setPendingCount(batches.filter((b: any) => b.status === "HARVESTED" || b.status === "AT_PROCESSOR").length);
    setCertifiedCount(batches.filter((b: any) => b.status === "LAB_TESTED").length);
    setRecent(batches.filter((b: any) => b.status === "LAB_TESTED").slice(0, 3));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setShowCamera(false);
    router.push({ pathname: '/processor/upload-lab-test', params: { batchId: data } });
  };

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission Denied", "Camera is needed to scan batches.");
        return;
      }
    }
    setScanned(false);
    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Scan Farmer QR Code</Text>
            <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Lab Dashboard</Text>
        <Text style={styles.subtitle}>Verify and Certify Harvests</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="qr-code-outline" size={60} color="#2e7d32" />
        <Text style={styles.cardTitle}>Scan Incoming Batch</Text>
        <Text style={styles.cardDesc}>Scan the QR code to attach a lab report.</Text>

        <TouchableOpacity style={styles.btn} onPress={startScan}>
          <Text style={styles.btnText}>Open Scanner</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{certifiedCount}</Text>
          <Text style={styles.statLabel}>Certified</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Certifications</Text>
      {recent.map((b) => (
        <View key={b.batch_id} style={styles.logItem}>
          <Ionicons name="flask" size={24} color="#666" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.logTitle}>Batch #{b.batch_id} ({b.crop_name})</Text>
            <Text style={styles.logSub}>Passed - Grade {b.quality_grade || "N/A"}</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color="green" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { marginTop: 40, marginBottom: 30 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666' },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 3, marginBottom: 30 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  cardDesc: { textAlign: 'center', color: '#666', marginBottom: 20 },
  btn: { backgroundColor: '#2e7d32', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { backgroundColor: '#fff', width: '48%', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  statLabel: { color: '#888' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  logItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 1, marginBottom: 8 },
  logTitle: { fontWeight: '600', fontSize: 16 },
  logSub: { color: '#666', fontSize: 12 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.6)', width: '100%', padding: 20, alignItems: 'center' },
  overlayText: { color: '#fff', fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  cancelBtn: { padding: 10, backgroundColor: 'red', borderRadius: 10 }
});
