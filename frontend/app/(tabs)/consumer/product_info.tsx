// app/consumer/product_info.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface JourneyStep {
  icon: IconName;
  title: string;
  desc: string;
  date: string;
  location: string;
}

export default function ProductInfoScreen() {
  const router = useRouter();

  const journeySteps: JourneyStep[] = [
    {
      icon: "sprout",
      title: "Harvested",
      desc: "Handpicked by local farmers",
      date: "12 Jan 2025",
      location: "Badrinath Valley, India",
    },
    {
      icon: "factory",
      title: "Processed",
      desc: "Eco-friendly extraction & testing",
      date: "15 Jan 2025",
      location: "EcoLab, Dehradun",
    },
    {
      icon: "truck",
      title: "Transported",
      desc: "Cold chain logistics maintained",
      date: "18 Jan 2025",
      location: "Rishikesh Logistics Hub",
    },
    {
      icon: "package-variant-closed",
      title: "Packaged",
      desc: "Sealed in certified facility",
      date: "20 Jan 2025",
      location: "Ayurveda Packaging Unit, Haridwar",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>🌿 Product Information</Text>

      {/* Journey Timeline */}
      <View style={styles.card}>
        <Text style={styles.label}>Journey</Text>
        {journeySteps.map((step, index) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.iconColumn}>
              <MaterialCommunityIcons name={step.icon} size={28} color="#15803d" />
              {index < journeySteps.length - 1 && <View style={styles.verticalLine} />}
            </View>
            <View style={styles.details}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
              <Text style={styles.stepMeta}>📅 {step.date}</Text>
              <Text style={styles.stepMeta}>📍 {step.location}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Origin */}
      <View style={styles.card}>
        <Text style={styles.label}>Origin</Text>
        <Text style={styles.value}>🌄 Badrinath Valley, India</Text>
      </View>

      {/* Lab Results */}
      <View style={styles.card}>
        <Text style={styles.label}>Lab Results</Text>
        <Text style={styles.value}>
          ✅ 98% Purity{"\n"}✅ Heavy Metals: Safe{"\n"}✅ Pesticides: None Detected
        </Text>
      </View>

      {/* Authenticity Badge */}
      <View style={[styles.card, styles.badge]}>
        <Text style={styles.label}>Authenticity Badge</Text>
        <Text style={styles.value}>🔒 Verified on Blockchain</Text>
      </View>

      {/* Feedback Form Button */}
      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => router.push("/consumer/feedback")}
      >
        <Text style={styles.feedbackButtonText}>📝 Give Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  value: { fontSize: 16, color: "#555", lineHeight: 22 },

  // Timeline
  timelineItem: { flexDirection: "row", marginBottom: 20 },
  iconColumn: { alignItems: "center", marginRight: 15 },
  verticalLine: { width: 2, flex: 1, backgroundColor: "#16a34a", marginTop: 5 },
  details: { flex: 1 },
  stepTitle: { fontSize: 18, fontWeight: "bold", color: "#166534" },
  stepDesc: { fontSize: 15, color: "#444", marginBottom: 4 },
  stepMeta: { fontSize: 13, color: "#666" },

  // Badge
  badge: { backgroundColor: "#dcfce7", borderColor: "#16a34a", borderWidth: 1 },

  // Feedback button
  feedbackButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  feedbackButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});
