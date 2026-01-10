import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Navbar from "../components/Navbar";

const statuses = [
  "Processing",
  "Quality Approved",
  "Packed",
  "Ready for Dispatch",
];

export default function UpdateBatchStatus() {
  const [selected, setSelected] = useState<string | null>(null);

  const updateStatus = (status: string) => {
    setSelected(status);
    Alert.alert("Status Updated", `Batch marked as "${status}"`);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Update Batch Status</Text>

      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusButton,
            selected === status && styles.active,
          ]}
          onPress={() => updateStatus(status)}
        >
          <Text style={styles.text}>{status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 20,
    marginVertical: 6,
    alignItems: "center",
  },
  active: { backgroundColor: "#16a34a" },
  text: { fontWeight: "600", color: "#166534" },
});
