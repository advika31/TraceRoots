import { ScrollView, StyleSheet, Text, View } from "react-native";
import Navbar from "../components/Navbar";

export default function History() {
  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Previous Batches</Text>

      {[101, 102, 103].map((id) => (
        <View key={id} style={styles.batchCard}>
          <Text style={styles.batchTitle}>Batch ID: TR-{id}</Text>
          <Text style={styles.batchText}>Status: Quality Approved</Text>
          <Text style={styles.batchText}>AI Authenticity: 95%</Text>
          <Text style={styles.batchText}>Blockchain: Synced</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0fdf4",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginVertical: 20,
  },
  batchCard: {
    backgroundColor: "#dcfce7",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  batchTitle: {
    fontWeight: "bold",
    color: "#166534",
  },
  batchText: {
    color: "#166534",
    marginTop: 4,
  },
});
