import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

type Message = {
  sender: string;
  role: string;
  content: string;
  priority: "Normal" | "Important" | "Urgent";
  time: string;
};

export default function RegulatorMessaging() {
  const [newMessage, setNewMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "District Forest Officer",
      role: "Almora Division",
      content: "Monthly compliance report submitted for review.",
      priority: "Normal",
      time: "Today, 10:15 AM",
    },
    {
      sender: "System Alert",
      role: "Automated",
      content: "Pithoragarh Timber Zone exceeded sustainable batch limit.",
      priority: "Urgent",
      time: "Yesterday, 6:40 PM",
    },
    {
      sender: "Field Inspector",
      role: "Champawat",
      content: "Illegal harvesting activity reported near Lohaghat range.",
      priority: "Important",
      time: "Yesterday, 2:20 PM",
    },
  ]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      sender: "You",
      role: "Regulator",
      content: newMessage,
      priority: "Normal",
      time: "Just now",
    };

    setMessages([msg, ...messages]);
    setNewMessage("");
    Alert.alert("Message Sent", "Your communication has been delivered.");
  };

  const getPriorityStyle = (p: string) => {
    if (p === "Urgent") return styles.urgent;
    if (p === "Important") return styles.important;
    return styles.normal;
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Regulator Messaging Center</Text>

      {/* Compose Box */}
      <View style={styles.composeCard}>
        <Text style={styles.sectionTitle}>Compose Message</Text>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Write instruction or communication..."
          multiline
          style={styles.textarea}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Inbox */}
      <Text style={styles.sectionTitle}>Inbox</Text>

      {messages.map((msg, index) => (
        <View key={index} style={styles.messageCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.sender}>{msg.sender}</Text>
              <Text style={styles.role}>{msg.role}</Text>
            </View>
            <Text style={[styles.priority, getPriorityStyle(msg.priority)]}>
              {msg.priority}
            </Text>
          </View>

          <Text style={styles.content}>{msg.content}</Text>
          <Text style={styles.time}>{msg.time}</Text>
        </View>
      ))}
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
  composeCard: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 10,
  },
  textarea: {
    backgroundColor: "#fff",
    minHeight: 90,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1fae5",
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageCard: {
    backgroundColor: "#f0fdfa",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccfbf1",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sender: {
    fontWeight: "bold",
    color: "#064e3b",
  },
  role: {
    fontSize: 12,
    color: "#6b7280",
  },
  content: {
    color: "#374151",
    marginBottom: 8,
  },
  time: {
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "right",
  },
  priority: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
  normal: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  important: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  urgent: {
    backgroundColor: "#fee2e2",
    color: "#7f1d1d",
  },
});
