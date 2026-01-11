// /frontend/app/(tabs)/collector/generate-batch.tsx

import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";

export default function GenerateBatch() {
  const { batchId } = useLocalSearchParams<{ batchId: string }>();

  if (!batchId) {
    return <Text>Invalid Batch</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Batch & QR Code</Text>

      <Text style={styles.batchId}>{batchId}</Text>

      <QRCode value={String(batchId)} />

      <Text style={styles.note}>Scan this QR to view product traceability</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 20,
  },
  batchId: { fontSize: 18, marginBottom: 20 },
  note: { marginTop: 20, color: "#374151" },
});
