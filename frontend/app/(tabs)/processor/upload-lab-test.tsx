import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Navbar from "../components/Navbar";

export default function UploadLabTest() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });

    if (!result.canceled) {
      setFileName(result.assets[0].name);
      setAiResult(null);
    }
  };

  const runAIAnalysis = () => {
    const isAuthentic = Math.random() > 0.3;
    setAiResult(isAuthentic ? "Authentic ✅ (97%)" : "Suspicious ⚠️ (Possible Adulteration)");
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Upload Lab Test</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={pickFile}>
        <Text style={styles.primaryText}>Upload PDF / Image</Text>
      </TouchableOpacity>

      {fileName && <Text style={styles.file}>Uploaded: {fileName}</Text>}

      {fileName && (
        <TouchableOpacity style={styles.secondaryButton} onPress={runAIAnalysis}>
          <Text style={styles.secondaryText}>Run AI Analysis</Text>
        </TouchableOpacity>
      )}

      {aiResult && <Text style={styles.result}>{aiResult}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#15803d",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    borderColor: "#16a34a",
    borderWidth: 1,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
  secondaryText: { color: "#16a34a", fontWeight: "600" },
  file: { marginTop: 15, color: "#166534" },
  result: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#166534",
    fontSize: 16,
  },
});
