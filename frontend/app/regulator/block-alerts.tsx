import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function BlockAlerts() {
  const [search, setSearch] = useState("");

  const blockedZones = [
    {
      area: "Pithoragarh Timber Belt",
      district: "Pithoragarh",
      vegetation: "Teak, Bamboo",
      reason: "Harvesting exceeded sustainable limit",
      blockedSince: "12 Jan 2025",
    },
    {
      area: "Champawat Reserve Zone",
      district: "Champawat",
      vegetation: "Sal, Bamboo",
      reason: "Illegal batch reporting detected",
      blockedSince: "03 Feb 2025",
    },
    {
      area: "Binsar Buffer Forest",
      district: "Almora",
      vegetation: "Oak, Rhododendron",
      reason: "Excessive seasonal extraction",
      blockedSince: "25 Dec 2024",
    },
    {
      area: "Lohaghat Forest Range",
      district: "Champawat",
      vegetation: "Pine, Deodar",
      reason: "Multiple compliance violations",
      blockedSince: "18 Jan 2025",
    },
  ];

  const filtered = blockedZones.filter(
    (zone) =>
      zone.area.toLowerCase().includes(search.toLowerCase()) ||
      zone.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Over-Harvesting Blocked Zones</Text>

      {/* Search */}
      <TextInput
        placeholder="Search by area or district..."
        placeholderTextColor="#6b7280"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Cards */}
      {filtered.map((zone, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.area}>{zone.area}</Text>
            <Text style={styles.blockBadge}>BLOCKED</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>{zone.district}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vegetation:</Text>
            <Text style={styles.value}>{zone.vegetation}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Reason:</Text>
            <Text style={styles.value}>{zone.reason}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Blocked Since:</Text>
            <Text style={styles.value}>{zone.blockedSince}</Text>
          </View>
        </View>
      ))}

      {filtered.length === 0 && (
        <Text style={styles.noResult}>No matching blocked zone found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7f1d1d",
    marginVertical: 16,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#fee2e2",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 20,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff1f2",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  area: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#7f1d1d",
    flex: 1,
  },
  blockBadge: {
    backgroundColor: "#dc2626",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "600",
    color: "#991b1b",
    marginRight: 6,
  },
  value: {
    color: "#374151",
    flex: 1,
  },
  noResult: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 30,
  },
});
