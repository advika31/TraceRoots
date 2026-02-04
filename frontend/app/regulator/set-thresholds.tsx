import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { RegulatorAPI } from "@/services/api";

export default function SetThresholds() {
  const [limit, setLimit] = useState("500");
  const [banned, setBanned] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await RegulatorAPI.getThresholds();
      setLimit(String(data.max_harvest_limit || "500"));
      setBanned(String(data.banned_regions || ""));
    };
    load();
  }, []);

  const handleSave = async () => {
    const max = Number(limit);
    if (Number.isNaN(max)) {
      Alert.alert("Invalid", "Please enter a valid number.");
      return;
    }
    await RegulatorAPI.updateThresholds({ max_harvest_limit: max, banned_regions: banned });
    Alert.alert("Thresholds Updated", "New regulatory limits have been saved.");
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Set Sustainability Thresholds</Text>

      <Text style={styles.label}>Max Harvest Limit (kg per farmer)</Text>
      <TextInput
        value={limit}
        onChangeText={setLimit}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Banned Regions (comma separated)</Text>
      <TextInput
        value={banned}
        onChangeText={setBanned}
        style={styles.input}
        placeholder="Banned Zone 1,Banned Zone 2"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Thresholds</Text>
      </TouchableOpacity>
    </View>
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
