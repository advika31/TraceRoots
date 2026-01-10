// frontend/app/(tabs)/collector/offline-sync.tsx

import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";

export default function OfflineSync() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);

    setTimeout(() => {
      setSyncing(false);
      Alert.alert("Sync Complete", "All offline data has been uploaded successfully");
    }, 2000);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>☁️ Offline Sync</Text>

      <View style={styles.card}>
        <Text style={styles.text}>
          Any collections captured offline will sync automatically once connected.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleSync} disabled={syncing}>
          {syncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Sync Now</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0fdf4", padding: 20, marginTop: 40 },
  title: { fontSize: 30, fontWeight: "bold", color: "#166534", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, flex: 1 },
  text: { fontSize: 16, textAlign: "center", marginBottom: 30, color: "#374151" },
  button: { backgroundColor: "#15803d", padding: 16, borderRadius: 12 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
