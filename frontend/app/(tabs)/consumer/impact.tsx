// app/consumer/impact.tsx

import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import API from "@/services/api";

interface ImpactSummary {
  co2Saved: number;
  wasteReduced: number;
  sustainablePercentage: number;
}

export default function ConsumerImpact() {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await API.get("/consumer/analytics/summary");
        setImpact(res.data);
      } catch (error) {
        console.log("Impact fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading impact stats...</Text>
      </View>
    );
  }

  if (!impact) {
    return (
      <View style={styles.center}>
        <Text>No impact data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Your Impact</Text>

      <View style={styles.card}>
        <Text style={styles.metric}>🌍 CO₂ Saved</Text>
        <Text style={styles.value}>{impact.co2Saved} kg</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metric}>♻️ Waste Reduced</Text>
        <Text style={styles.value}>{impact.wasteReduced} kg</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.metric}>✅ Sustainable Sourcing</Text>
        <Text style={styles.value}>{impact.sustainablePercentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  metric: {
    fontSize: 18,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#15803d",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
