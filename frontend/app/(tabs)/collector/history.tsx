// /frontend/app/(tabs)/collector/history.tsx
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import API from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEMO_BATCHES = [
  {
    id: 1,
    crop_type: "Wheat",
    quantity_kg: 100,
    status: "pending",
  },
  {
    id: 2,
    crop_type: "Millet",
    quantity_kg: 60,
    status: "distributed",
  },
];

interface Batch {
  id: number;
  crop_type: string;
  quantity_kg: number;
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

        const res = await API.get("/batches/all");

        const list = res.data.filter(
          (batch: any) => batch.farmer_id === farmer.id
        );

        setBatches(list.length > 0 ? list : DEMO_BATCHES);
      } catch (error) {
        console.log("Error fetching batches", error);
        setBatches(DEMO_BATCHES);
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
            <Text style={styles.herb}>{batch.crop_type}</Text>
            <Text>📦 Quantity: {batch.quantity_kg} kg</Text>
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
    paddingBottom: 100,
    marginTop: 40,
  },
  title: {
    fontSize: 30,
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
    fontSize: 20,
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
