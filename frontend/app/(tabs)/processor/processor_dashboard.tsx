import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/Navbar";

export default function ProcessorDashboard() {
  const router = useRouter();

  const actions = [
    { title: "Scan Batch", icon: "qr-code-scanner", route: "/processor/scan-batch" },
    { title: "Upload Lab Test", icon: "file-upload", route: "/processor/upload-lab-test" },
    { title: "Update Batch Status", icon: "update", route: "/processor/update-batch-status" },
    { title: "View Previous Batches", icon: "history", route: "/processor/history" },
    { 
      title: "Request Sync to Blockchain", 
      icon: "cloud-upload", 
      route: "/processor/request-sync", 
      special: true // mark special for gradient styling
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
       {/* ✅ Navbar added at top */}
      <Navbar />
      <Text style={styles.title}>Welcome, Processor ID: Ar123</Text>
      
      <View style={styles.cardContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, action.special && styles.specialCard]}
            onPress={() => router.push(action.route)}
          >
            <View style={styles.cardContent}>
              <MaterialIcons name={action.icon as any} size={32} color={action.special ? "#fff" : "#16a34a"} />
              <Text style={[styles.cardText, action.special && styles.specialCardText]}>
                {action.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 30,
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around", // changed from space-between
  },
  card: {
    backgroundColor: "#dcfce7",
    width: "45%", // slightly smaller to fit well
    marginVertical: 10,
    borderRadius: 16,
    paddingVertical: 25, // reduced padding
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center", // center the content
  },
  specialCard: {
    backgroundColor: "#16a34a",
    shadowOpacity: 0.2,
  },
  cardContent: {
    alignItems: "center",
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#15803d",
    textAlign: "center",
  },
  specialCardText: {
    color: "#fff",
  },
});
