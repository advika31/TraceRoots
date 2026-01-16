// frontend/app/regulator/batch-lookup.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import API from "@/services/api";

export default function RegulatorBatchLookup() {
  const [batchId, setBatchId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBatch = async () => {
    if (!batchId) {
      Alert.alert("Please enter Batch ID");
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/regulator/batch/${batchId}`);
      setData(res.data);
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.detail || "Batch not found"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Batch Lookup</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Batch ID"
        keyboardType="numeric"
        value={batchId}
        onChangeText={setBatchId}
      />

      <TouchableOpacity style={styles.button} onPress={fetchBatch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Loading...</Text>}

      {data && (
        <View style={styles.card}>
          <Text style={styles.section}>Batch Info</Text>
          <Text>🌾 Crop: {data.crop_type}</Text>
          <Text>📦 Quantity: {data.quantity_kg} kg</Text>
          <Text>🧾 Status: {data.status}</Text>

          <Text style={styles.section}>Farmer</Text>
          <Text>👨‍🌾 Name: {data.farmer.name}</Text>
          <Text>📍 Location: {data.farmer.location}</Text>

          <Text style={styles.section}>Lab Test</Text>
          {data.lab_test ? (
            <>
              <Text>✅ Purity: {data.lab_test.purity_percent}%</Text>
              <Text>🧪 Heavy Metals: {data.lab_test.heavy_metals_safe}</Text>
              <Text>🧪 Pesticides: {data.lab_test.pesticides_safe}</Text>
              <Text>📝 Remarks: {data.lab_test.remarks}</Text>
            </>
          ) : (
            <Text>No lab test uploaded</Text>
          )}

          <Text style={styles.section}>Blockchain</Text>
          <Text>
            🔗 TX: {data.blockchain_tx || "Not synced"}
          </Text>
        </View>
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
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#166534",
  },
});
