// frontend/app/regulator/zone-details.tsx
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ZoneDetails() {
  const [search, setSearch] = useState("");

  const zones = [
    {
      area: "Almora Forest Belt",
      district: "Almora",
      vegetation: "Pine, Oak, Deodar",
      status: "Safe",
      batches: "128 (Last 6 months)",
    },
    {
      area: "Binsar Wildlife Zone",
      district: "Almora",
      vegetation: "Oak, Rhododendron",
      status: "Warning",
      batches: "212 (Last 6 months)",
    },
    {
      area: "Pithoragarh Timber Zone",
      district: "Pithoragarh",
      vegetation: "Teak, Bamboo",
      status: "Overexploited",
      batches: "390 (Last 6 months)",
    },
    {
      area: "Nainital Forest Division",
      district: "Nainital",
      vegetation: "Pine, Cedar",
      status: "Safe",
      batches: "145 (Last 6 months)",
    },
    {
      area: "Champawat Reserve",
      district: "Champawat",
      vegetation: "Sal, Bamboo",
      status: "Warning",
      batches: "260 (Last 6 months)",
    },
  ];

  const filteredZones = zones.filter(
    (zone) =>
      zone.area.toLowerCase().includes(search.toLowerCase()) ||
      zone.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Zone Details & Sustainability Status</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search by area or district..."
        placeholderTextColor="#6b7280"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Cards */}
      {filteredZones.map((zone, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.area}>{zone.area}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>District:</Text>
            <Text style={styles.value}>{zone.district}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Vegetation:</Text>
            <Text style={styles.value}>{zone.vegetation}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Batches Produced:</Text>
            <Text style={styles.value}>{zone.batches}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.status,
                zone.status === "Safe" && styles.safe,
                zone.status === "Warning" && styles.warning,
                zone.status === "Overexploited" && styles.danger,
              ]}
            >
              {zone.status}
            </Text>
          </View>
        </View>
      ))}

      {filteredZones.length === 0 && (
        <Text style={styles.noResult}>No matching area found</Text>
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
    color: "#14532d",
    marginVertical: 16,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#dcfce7",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    marginBottom: 20,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    elevation: 2,
  },
  area: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "600",
    color: "#047857",
    marginRight: 6,
  },
  value: {
    color: "#374151",
  },
  status: {
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  safe: {
    backgroundColor: "#bbf7d0",
    color: "#166534",
  },
  warning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  danger: {
    backgroundColor: "#fecaca",
    color: "#7f1d1d",
  },
  noResult: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 30,
  },
});
