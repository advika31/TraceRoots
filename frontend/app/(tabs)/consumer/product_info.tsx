// app/consumer/product_info.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import API from "@/services/api";

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
  const { batchId } = useLocalSearchParams<{ batchId: string }>();
  const [journeySteps, setJourneySteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onChain, setOnChain] = useState<boolean | null>(null);
  const [cropType, setCropType] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const traceRes = await API.get(`/consumer/trace/${batchId}`);
        // setJourneySteps(traceRes.data.journey);
        setJourneySteps([
  {
    icon: "sprout",
    title: "Harvested",
    desc: `Harvested by ${traceRes.data.farmer_name}`,
    date: "10 Jan 2025",
    location: "Uttarakhand, India",
  },
  {
    icon: "truck",
    title: "Transported",
    desc: "Cold-chain transport maintained",
    date: "12 Jan 2025",
    location: "Dehradun",
  },
  {
    icon: "package-variant",
    title: "Packaged",
    desc: "Packaged under safety norms",
    date: "14 Jan 2025",
    location: "Haridwar",
  },
]);

        setCropType(traceRes.data.crop_type);

        const bcRes = await API.get(
          `/blockchain/batch/${batchId}?crop_type=${traceRes.data.crop_type}`
        );
        setOnChain(bcRes.data.on_chain);
      } catch (e) {
        console.log("Trace / Blockchain fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchData();
  }, [batchId]);

  if (!batchId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Invalid or missing batch ID</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>🌿 Product Information</Text>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading product journey...
        </Text>
      ) : (
        <>
          {/* Journey Timeline */}
          <View style={styles.card}>
            <Text style={styles.label}>Journey</Text>

            {journeySteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.iconColumn}>
                  <MaterialCommunityIcons
                    name={step.icon}
                    size={28}
                    color="#15803d"
                  />
                  {index < journeySteps.length - 1 && (
                    <View style={styles.verticalLine} />
                  )}
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
        </>
      )}

      {/* Origin */}
      <View style={styles.card}>
        <Text style={styles.label}>Origin</Text>
        <Text style={styles.value}>🌄 Badrinath Valley, India</Text>
      </View>

      {/* Lab Results */}
      <View style={styles.card}>
        <Text style={styles.label}>Lab Results</Text>
        <Text style={styles.value}>
          ✅ 98% Purity{"\n"}✅ Heavy Metals: Safe{"\n"}✅ Pesticides: None
          Detected
        </Text>
      </View>

      {/* Authenticity Badge */}

      <View style={[styles.card, styles.badge]}>
        <Text style={styles.label}>Blockchain Proof</Text>

        {onChain === true && (
          <Text style={styles.value}>✅ Verified on Blockchain</Text>
        )}

        {onChain === false && <Text style={styles.value}>❌ Not Verified</Text>}

        {onChain === null && (
          <Text style={styles.value}>⏳ Checking verification...</Text>
        )}
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
