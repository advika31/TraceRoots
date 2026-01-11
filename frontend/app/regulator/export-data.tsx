// frontend/app/regulator/export-data.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ExportData() {
  const [zone, setZone] = useState("");
  const [status, setStatus] = useState("");

  const sampleData = [
    { area: "Almora Forest Belt", district: "Almora", batches: 128, status: "Safe" },
    { area: "Binsar Wildlife Zone", district: "Almora", batches: 212, status: "Warning" },
    { area: "Pithoragarh Timber Zone", district: "Pithoragarh", batches: 390, status: "Overexploited" },
    { area: "Nainital Forest Division", district: "Nainital", batches: 145, status: "Safe" },
  ];

  const filteredData = sampleData.filter((item) => {
    return (
      (zone === "" || item.area.toLowerCase().includes(zone.toLowerCase())) &&
      (status === "" || item.status === status)
    );
  });

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Export Sustainability & Traceability Data</Text>

      {/* Filters */}
      <View style={styles.filterCard}>
        <Text style={styles.sectionTitle}>Filters</Text>

        <TextInput
          placeholder="Filter by Zone (e.g. Almora)"
          value={zone}
          onChangeText={setZone}
          style={styles.input}
        />

        <View style={styles.statusRow}>
          {["Safe", "Warning", "Overexploited"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setStatus(status === item ? "" : item)}
              style={[
                styles.statusButton,
                status === item && styles.activeStatus,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === item && styles.activeStatusText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.sectionTitle}>Preview Data</Text>

        {filteredData.map((item, index) => (
          <View key={index} style={styles.previewRow}>
            <Text style={styles.previewArea}>{item.area}</Text>
            <Text style={styles.previewMeta}>
              {item.district} • {item.batches} batches • {item.status}
            </Text>
          </View>
        ))}

        {filteredData.length === 0 && (
          <Text style={styles.noData}>No data matches selected filters</Text>
        )}
      </View>

      {/* Export Actions */}
      <View style={styles.exportCard}>
        <Text style={styles.sectionTitle}>Export Format</Text>

        <View style={styles.formatRow}>
          <TouchableOpacity style={styles.formatButton}>
            <Text style={styles.formatText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <Text style={styles.formatText}>Excel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton}>
            <Text style={styles.formatText}>PDF</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#14532d",
    textAlign: "center",
    marginVertical: 16,
  },
  filterCard: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  previewCard: {
    backgroundColor: "#f0fdfa",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccfbf1",
  },
  exportCard: {
    backgroundColor: "#dcfce7",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#16a34a",
  },
  statusText: {
    color: "#374151",
    fontWeight: "600",
  },
  activeStatusText: {
    color: "#fff",
  },
  previewRow: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  previewArea: {
    fontWeight: "bold",
    color: "#064e3b",
  },
  previewMeta: {
    color: "#6b7280",
    fontSize: 13,
  },
  noData: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 10,
  },
  formatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formatButton: {
    flex: 1,
    backgroundColor: "#bbf7d0",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  formatText: {
    fontWeight: "bold",
    color: "#065f46",
  },
  exportButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
