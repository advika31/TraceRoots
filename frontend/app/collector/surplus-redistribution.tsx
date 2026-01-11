// frontend/app/(tabs)/collector/surplus-redistribution.tsx

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

export default function SurplusRedistribution() {
  const router = useRouter();

  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ngoId, setNgoId] = useState("");

  const handleDonate = async () => {
    if (!batchId || !quantity || !ngoId) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      await API.post("/surplus/redistribute", {
        batch_id: Number(batchId),
        ngo_name: ngoId,
      });

      Alert.alert("Success", "Surplus redistributed to NGO");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message || "Could not redistribute surplus"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Surplus Redistribution</Text>

      <TextInput
        style={styles.input}
        placeholder="Batch ID"
        keyboardType="numeric"
        value={batchId}
        onChangeText={setBatchId}
      />

      <TextInput
        style={styles.input}
        placeholder="NGO Name"
        value={ngoId}
        onChangeText={setNgoId}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={handleDonate}>
        <Text style={styles.buttonText}>Donate Surplus</Text>
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
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 15,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});
