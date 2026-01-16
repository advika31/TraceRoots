// frontend/app/processor/history.tsx
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import API from "@/services/api";

type Batch = {
  batch_id: number;
  crop_type: string;
  quantity_kg: number;
  status: string;
  farmer_name: string;
};

export default function ProcessorHistory() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await API.get("/processor/batches");
        if (Array.isArray(res.data)) {
          setBatches(res.data);
        } else {
          console.log("Unexpected response:", res.data);
          setBatches([]);
        }
      } catch (e) {
        console.log("Failed to fetch processor batches", e);
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
      <Text style={styles.title}>Processed Batches</Text>

      {batches.length === 0 ? (
        <Text style={styles.empty}>No batches found</Text>
      ) : (
        batches.map((batch) => (
          <View key={batch.batch_id} style={styles.card}>
            <Text style={styles.crop}>{batch.crop_type}</Text>
            <Text>📦 Quantity: {batch.quantity_kg} kg</Text>
            <Text>👨‍🌾 Farmer: {batch.farmer_name}</Text>
            <Text>🧾 Status: {batch.status}</Text>
            <Text style={styles.id}>Batch ID: {batch.batch_id}</Text>
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
  crop: {
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
