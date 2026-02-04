import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";

export default function GenerateBatch() {
  const { batchId, qrUrl } = useLocalSearchParams();
  const id = typeof batchId === "string" ? batchId : "UNKNOWN";
  const rawQr = typeof qrUrl === "string" ? qrUrl : "";
  const qr = rawQr.startsWith("http")
    ? rawQr
    : rawQr
      ? `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"}${rawQr}`
      : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Batch and QR Code</Text>

      <Text style={styles.batchId}>{id}</Text>

      {qr ? (
        <Image source={{ uri: qr }} style={styles.qrImage} />
      ) : (
        <QRCode value={id} size={220} />
      )}

      <Text style={styles.note}>
        Scan this QR to view product traceability
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f0fdf4", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#166534", marginBottom: 20 },
  batchId: { fontSize: 18, marginBottom: 20 },
  qrImage: { width: 220, height: 220, resizeMode: "contain" },
  note: { marginTop: 20, color: "#374151" },
});
