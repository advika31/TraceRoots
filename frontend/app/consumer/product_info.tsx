// frontend/app/consumer/product_info.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ConsumerAPI } from '../../services/api';

export default function ProductInfo() {
  const { batchId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (batchId) fetchData(batchId as string);
  }, [batchId]);

  const fetchData = async (id: string) => {
    const result = await ConsumerAPI.getStory(id);
    if (result) {
      setData(result);
    } else {
      Alert.alert("Error", "Product not found");
    }
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2e7d32"/></View>;
  if (!data) return <View style={styles.center}><Text>Product Not Found</Text></View>;

  const { batch_details, story_narrative, verification } = data;

  return (
    <ScrollView style={styles.container}>
      {/* Hero Image */}
      <Image source={{ uri: `http://192.168.1.9:8000${batch_details.video_story_url}` }} style={styles.image} />
      
      <View style={styles.content}>
        {/* Title & Badge */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{batch_details.crop_name}</Text>
            <Text style={styles.subtitle}>Harvested {new Date(batch_details.harvest_date).toLocaleDateString()}</Text>
          </View>
          <Ionicons name="shield-checkmark" size={40} color="#2e7d32" />
        </View>

        {/* The AI Story */}
        <View style={styles.storyBox}>
          <Text style={styles.storyTitle}>🌱 The Journey</Text>
          <Text style={styles.storyText}>{story_narrative}</Text>
        </View>

        {/* Timeline */}
        <Text style={styles.sectionHeader}>Traceability Timeline</Text>
        {data.timeline.map((event: any, i: number) => (
          <View key={i} style={styles.timelineItem}>
            <View style={styles.timelineLine} />
            <View style={styles.timelineIcon}>
              <Ionicons name={event.icon} size={20} color="#fff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.eventTitle}>{event.event}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
          </View>
        ))}

        {/* Blockchain Verification */}
        <View style={styles.verifyBox}>
          <Text style={styles.verifyTitle}>Blockchain Verified</Text>
          <Text style={styles.hash}>Hash: {verification.blockchain_hash}</Text>
          <Text style={styles.status}>Immutable • Transparent • Trusted</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250, backgroundColor: '#eee' },
  content: { padding: 20,  borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1b5e20' },
  subtitle: { color: '#666', fontSize: 14 },
  storyBox: { backgroundColor: '#f1f8e9', padding: 20, borderRadius: 15, marginBottom: 25 },
  storyTitle: { fontWeight: 'bold', color: '#33691e', marginBottom: 10, fontSize: 16 },
  storyText: { lineHeight: 24, color: '#333', fontSize: 15 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  timelineItem: { flexDirection: 'row', marginBottom: 20, position: 'relative' },
  timelineLine: { position: 'absolute', left: 20, top: 0, bottom: -20, width: 2, backgroundColor: '#ddd', zIndex: -1 },
  timelineIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2e7d32', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  timelineContent: { justifyContent: 'center' },
  eventTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  eventDate: { color: '#888', fontSize: 12 },
  verifyBox: { marginTop: 20, padding: 15, backgroundColor: '#212121', borderRadius: 10, alignItems: 'center' },
  verifyTitle: { color: '#4caf50', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  hash: { color: '#757575', fontSize: 10, marginBottom: 5 },
  status: { color: '#aaa', fontSize: 12 }
});