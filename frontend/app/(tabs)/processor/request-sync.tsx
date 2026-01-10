import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Navbar from "../components/Navbar";

export default function RequestSync() {
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(false);

  const syncBlockchain = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSynced(true);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Blockchain Sync</Text>

      {!loading && !synced && (
        <TouchableOpacity style={styles.syncButton} onPress={syncBlockchain}>
          <Text style={styles.syncText}>Request Blockchain Sync</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#16a34a" />}

      {synced && (
        <Text style={styles.success}>
          Synced Successfully ✅{"\n"}
          Tx Hash: 0xA94F...32B
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 20,
  },
  syncButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  syncText: { color: "#fff", fontWeight: "600" },
  success: {
    marginTop: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#166534",
  },
});
