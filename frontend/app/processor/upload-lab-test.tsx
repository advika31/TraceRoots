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

export default function UploadLabTest() {
  const router = useRouter();

  const [batchId, setBatchId] = useState("");
  const [purity, setPurity] = useState("");
  const [heavyMetalsSafe, setHeavyMetalsSafe] = useState("");
  const [pesticidesSafe, setPesticidesSafe] = useState("");
  const [remarks, setRemarks] = useState("");

  const submitLabTest = async () => {
    if (!batchId || !purity || !heavyMetalsSafe || !pesticidesSafe) {
      Alert.alert("All required fields must be filled");
      return;
    }

    try {
      await API.post("/processor/lab-test", {
        batch_id: Number(batchId),
        purity_percent: Number(purity),
        heavy_metals_safe: heavyMetalsSafe,
        pesticides_safe: pesticidesSafe,
        remarks,
      });

      Alert.alert("Success", "Lab test uploaded successfully");
      router.back();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.detail || "Failed to upload lab test"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Lab Test</Text>

      <TextInput
        style={styles.input}
        placeholder="Batch ID"
        keyboardType="numeric"
        value={batchId}
        onChangeText={setBatchId}
      />

      <TextInput
        style={styles.input}
        placeholder="Purity (%)"
        keyboardType="numeric"
        value={purity}
        onChangeText={setPurity}
      />

      <TextInput
        style={styles.input}
        placeholder="Heavy Metals Safe? (yes/no)"
        value={heavyMetalsSafe}
        onChangeText={setHeavyMetalsSafe}
      />

      <TextInput
        style={styles.input}
        placeholder="Pesticides Safe? (yes/no)"
        value={pesticidesSafe}
        onChangeText={setPesticidesSafe}
      />

      <TextInput
        style={styles.input}
        placeholder="Remarks (optional)"
        value={remarks}
        onChangeText={setRemarks}
      />

      <TouchableOpacity style={styles.button} onPress={submitLabTest}>
        <Text style={styles.buttonText}>Submit Lab Test</Text>
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
