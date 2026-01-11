// /frontend/app/collector/new-collection.tsx

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
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "@/services/api";

export default function NewCollection() {
  const router = useRouter();

  const [herbName, setHerbName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateBatch = async () => {
    if (!herbName || !quantity || !location) {
      Alert.alert("All fields are required");
      return;
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Quantity must be a valid number");
      return;
    }

    try {
      setLoading(true);

      const data = await AsyncStorage.getItem("collector");
      if (!data) {
        Alert.alert("Error", "Collector not found. Please log in again.");
        return;
      }

      const farmer = JSON.parse(data);

      const res = await API.post("/batches/add", {
        farmer_id: farmer.id,
        crop_type: herbName,
        quantity_kg: qty,
        location: location,
      });

      Alert.alert("Success", "Batch created successfully", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/collector/generate-batch",
              params: { batchId: res.data.id },
            }),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message || "Could not create batch"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Batch</Text>

      <TextInput
        style={styles.input}
        placeholder="Herb Name"
        value={herbName}
        onChangeText={setHerbName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity (kg)"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TextInput
        style={styles.input}
        placeholder="Collection Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleCreateBatch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Batch"}
        </Text>
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
