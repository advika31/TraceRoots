// frontend/app/(tabs)/collector/herb-fingerprint.tsx

import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function HerbFingerprint() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setResult(null);
    }
  };

  const submitForAnalysis = () => {
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setResult(
        "✅ Herb identified as Ashwagandha\n🌱 Purity: 96%\n⚠️ No adulterants detected"
      );
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>🌿 Herb Fingerprint</Text>

      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>No image captured</Text>
        )}

        <TouchableOpacity style={styles.primaryBtn} onPress={takePhoto}>
          <Text style={styles.btnText}>Capture Herb Image</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={submitForAnalysis}
            disabled={analyzing}
          >
            <Text style={styles.btnText}>
              {analyzing ? "Analyzing..." : "Submit for Analysis"}
            </Text>
          </TouchableOpacity>
        )}

        {result && <Text style={styles.result}>{result}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#f0fdf4",
    flexGrow: 1,
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#166534",
    textAlign: "center",
    marginBottom: 20,
  },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 15 },
  placeholder: { textAlign: "center", color: "#6b7280", marginVertical: 40 },
  primaryBtn: {
    backgroundColor: "#15803d",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  secondaryBtn: { backgroundColor: "#065f46", padding: 14, borderRadius: 12 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  result: {
    marginTop: 15,
    color: "#166534",
    fontWeight: "600",
    lineHeight: 22,
  },
});
