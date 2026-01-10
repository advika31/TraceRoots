import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

type Zone = {
  area: string;
  district: string;
  maxBatches: string;
  sustainabilityScore: string;
  alertLevel: string;
};

export default function SetThresholds() {
  const [search, setSearch] = useState("");

  const [zones, setZones] = useState<Zone[]>([
    {
      area: "Almora Forest Belt",
      district: "Almora",
      maxBatches: "200",
      sustainabilityScore: "70",
      alertLevel: "80",
    },
    {
      area: "Binsar Wildlife Zone",
      district: "Almora",
      maxBatches: "150",
      sustainabilityScore: "65",
      alertLevel: "75",
    },
    {
      area: "Pithoragarh Timber Zone",
      district: "Pithoragarh",
      maxBatches: "100",
      sustainabilityScore: "60",
      alertLevel: "70",
    },
    {
      area: "Nainital Forest Division",
      district: "Nainital",
      maxBatches: "220",
      sustainabilityScore: "72",
      alertLevel: "82",
    },
  ]);

  const handleChange = (index: number, field: keyof Zone, value: string) => {
    const updated = [...zones];
    updated[index][field] = value;
    setZones(updated);
  };

  const handleSave = () => {
    Alert.alert(
      "Thresholds Updated",
      "New regulatory limits have been saved successfully."
    );
    console.log("Updated thresholds:", zones);
  };

  const filteredZones = zones.filter(
    (z) =>
      z.area.toLowerCase().includes(search.toLowerCase()) ||
      z.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Set / Adjust Sustainability Thresholds</Text>

      {/* Search */}
      <TextInput
        placeholder="Search by area or district..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      {/* Zone Cards */}
      {filteredZones.map((zone, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.area}>{zone.area}</Text>
          <Text style={styles.district}>District: {zone.district}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Max Batches Allowed</Text>
            <TextInput
              value={zone.maxBatches}
              onChangeText={(v) => handleChange(index, "maxBatches", v)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Minimum Sustainability Score</Text>
            <TextInput
              value={zone.sustainabilityScore}
              onChangeText={(v) => handleChange(index, "sustainabilityScore", v)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Alert Trigger Level (%)</Text>
            <TextInput
              value={zone.alertLevel}
              onChangeText={(v) => handleChange(index, "alertLevel", v)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>
      ))}

      {filteredZones.length === 0 && (
        <Text style={styles.noResult}>No matching zone found</Text>
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save All Thresholds</Text>
      </TouchableOpacity>
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
    textAlign: "center",
    marginVertical: 16,
  },
  search: {
    backgroundColor: "#dcfce7",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    marginBottom: 16,
  },
  area: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#065f46",
  },
  district: {
    color: "#6b7280",
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  noResult: {
    textAlign: "center",
    color: "#6b7280",
    marginVertical: 20,
  },
});
