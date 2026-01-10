import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import API from "@/services/api";

export default function UpdateBatchStatus() {
  const router = useRouter();

  const [batchId, setBatchId] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const updateStatus = async () => {
    if (!batchId || !newStatus) {
      Alert.alert("Batch ID and status are required");
      return;
    }

    try {
      await API.patch("/processor/batch-status", {
        batch_id: Number(batchId),
        new_status: newStatus,
      });

      Alert.alert("Success", "Batch status updated");
      router.back();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.detail || "Failed to update status"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Batch Status</Text>

      <TextInput
        style={styles.input}
        placeholder="Batch ID"
        keyboardType="numeric"
        value={batchId}
        onChangeText={setBatchId}
      />

      <TextInput
        style={styles.input}
        placeholder="New Status (processed / approved)"
        value={newStatus}
        onChangeText={setNewStatus}
      />

      <TouchableOpacity style={styles.button} onPress={updateStatus}>
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#15803d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
