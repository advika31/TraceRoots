// /frontend/app/(tabs)/collector/new-collection.tsx

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
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function NewCollection() {
  const router = useRouter();

  const [herbName, setHerbName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const handleCreateBatch = async () => {
    if (!herbName || !quantity || !location) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      const data = await AsyncStorage.getItem("collector");
      const farmer = JSON.parse(data!);

      await API.post("/batches/add", {
        farmer_id: farmer.id,
        crop_type: herbName,
        quantity_kg: Number(quantity),
      });

      Alert.alert("Success", "Batch created successfully");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Failed",
        error?.response?.data?.message || "Could not create batch"
      );
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

      <TouchableOpacity style={styles.button} onPress={handleCreateBatch}>
        <Text style={styles.buttonText}>Create Batch</Text>
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
