// frontend/app/collector/collector_dashboard.tsx

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../components/Navbar"; // ✅ reusable navbar
import { useEffect, useState } from "react";
import API from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CollectorDashboard() {
  const router = useRouter();
  const [collectorName, setCollectorName] = useState("");
  const [batchCount, setBatchCount] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const loadCollector = async () => {
      const data = await AsyncStorage.getItem("collector");
      if (data) {
        const farmer = JSON.parse(data);
        setCollectorName(farmer.name);
      }
    };

    loadCollector();
    const fetchDashboardData = async () => {
      try {
        const batchesRes = await API.get("/batches/all");
        setBatchCount(batchesRes.data.length);

        const data = await AsyncStorage.getItem("collector");
        const farmer = JSON.parse(data!);

        const tokensRes = await API.get(`/farmers/tokens/${farmer.id}`);
        setTokens(tokensRes.data.tokens);
      } catch (error) {
        console.log("Dashboard fetch error", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Welcome Message */}
      <Text style={styles.welcomeText}>
        Welcome Collector {collectorName} !{" "}
      </Text>

      {/* Top Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          📡 Sync Status: <Text style={{ color: "#c1f0f0ff" }}>Online</Text>
        </Text>
        <Text style={styles.statusText}>📦 Total Batches: {batchCount}</Text>
        <Text style={styles.statusText}>🪙 Tokens Earned: {tokens}</Text>
        <Text style={styles.statusText}>🟢 Zone: Sustainable (Green)</Text>
      </View>

      {/* Features Grid */}
      <Text style={styles.sectionTitle}>Collector Tools</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/collector/new-collection")}
        >
          <MaterialIcons name="note-add" size={30} color="#15803d" />
          <Text style={styles.cardText}>New Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/collector/herb-fingerprint")}
        >
          <MaterialIcons name="camera-alt" size={30} color="#15803d" />
          <Text style={styles.cardText}>Herb Fingerprint</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/collector/generate-batch")}
        >
          <MaterialIcons name="qr-code-2" size={30} color="#15803d" />
          <Text style={styles.cardText}>Batch & QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/collector/surplus-redistribution")}
        >
          <MaterialIcons name="volunteer-activism" size={30} color="#15803d" />
          <Text style={styles.cardText}>Donate Surplus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/regulator/SustainabilityMap")}
        >
          <MaterialIcons name="map" size={30} color="#15803d" />
          <Text style={styles.cardText}>Sustainability Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0fdf4", // themed light green
    padding: 20,
    paddingBottom: 100,
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 20,
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#166534",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#f6f9f9ff",
  },
  statusText: {
    fontSize: 15,
    color: "#ffffffff",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    color: "#374151",
  },
});
