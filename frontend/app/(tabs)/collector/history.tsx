// /frontend/app/(tabs)/collector/history.tsx
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import API from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Batch {
  id: number;
  herbName: string;
  quantity: number;
  location: string;
  status: string;
}

export default function CollectorHistory() {

  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
  try {
    const stored = await AsyncStorage.getItem("collector");
    if (!stored) return;

    const farmer = JSON.parse(stored);

    const res = await API.get(`/batches/farmer/${farmer.id}`);

    const list = Array.isArray(res.data)
      ? res.data
      : res.data.batches || [];

    setBatches(list);
  } catch (error) {
    console.log("Error fetching batches", error);
    setBatches([]);
  } finally {
    setLoading(false);
  }
};

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading batches...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Batch History</Text>

      {batches.length === 0 ? (
        <Text style={styles.empty}>No batches found</Text>
      ) : (
        batches.map((batch) => (
          <View key={batch.id} style={styles.card}>
            <Text style={styles.herb}>{batch.herbName}</Text>
            <Text>📦 Quantity: {batch.quantity} kg</Text>
            <Text>📍 Location: {batch.location}</Text>
            <Text>🧾 Status: {batch.status}</Text>
            <Text style={styles.id}>Batch ID: {batch.id}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  herb: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 6,
  },
  id: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
