import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Navbar from "../components/Navbar";

export default function ScanBatch() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text>Camera permission required</Text>
      </View>
    );
  }

  const handleScan = () => {
    setScanned(true);
    Alert.alert(
      "Batch Verified ✅",
      "Batch ID: TR-102\nAI Authenticity Score: 96%\nBlockchain Trace: Available"
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Scan Batch QR</Text>

      <CameraView style={styles.camera} />

      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.scanText}>
          {scanned ? "Scanned ✔" : "Simulate QR Scan"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#15803d",
  },
  camera: {
    flex: 1,
    margin: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  scanButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 30,
    margin: 20,
    alignItems: "center",
  },
  scanText: { color: "#fff", fontWeight: "600" },
});
