// /frontend/app/(tabs)/collector/profile.tsx

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const [collector, setCollector] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("collector").then((data) => {
      if (data) setCollector(JSON.parse(data));
    });
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  if (!collector) return null;

  return (
    <View style={styles.page}>
      <Text style={styles.title}>👤 Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{collector.name?.[0]}</Text>
        </View>

        <Text style={styles.name}>{collector.name}</Text>
        <Text style={styles.info}>Wallet: {collector.wallet_address}</Text>
        <Text style={styles.info}>Location: {collector.location || "—"}</Text>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0fdf4", padding: 20, paddingBottom: 100, marginTop: 40 },
  title: { fontSize: 30, fontWeight: "bold", color: "#166534", textAlign: "center", marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center",  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#15803d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  info: { color: "#374151", marginBottom: 6 },
  logout: { marginTop: 30, backgroundColor: "#dc2626", padding: 14, borderRadius: 12, width: "100%" },
  logoutText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
