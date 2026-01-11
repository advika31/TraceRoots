// frontend/app/regulator/access-control.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState } from "react";
import Navbar from "../components/Navbar";

type User = {
  name: string;
  designation: string;
  role: "Viewer" | "Editor" | "Admin";
  active: boolean;
};

export default function AccessControl() {
  const [users, setUsers] = useState<User[]>([
    { name: "Rohit Mehra", designation: "Forest Officer, Almora", role: "Editor", active: true },
    { name: "Neha Joshi", designation: "Field Inspector, Pithoragarh", role: "Viewer", active: true },
    { name: "Amit Rawat", designation: "Data Analyst, Dehradun HQ", role: "Admin", active: true },
    { name: "Kavita Bisht", designation: "District Officer, Champawat", role: "Editor", active: false },
  ]);

  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const toggleAccess = (index: number) => {
    const updated = [...users];
    updated[index].active = !updated[index].active;
    setUsers(updated);
  };

  const changeRole = (index: number) => {
    const updated = [...users];
    const roles: User["role"][] = ["Viewer", "Editor", "Admin"];
    const currentIndex = roles.indexOf(updated[index].role);
    updated[index].role = roles[(currentIndex + 1) % roles.length];
    setUsers(updated);
  };

  const addUser = () => {
    if (!newName || !newDesignation) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    setUsers([
      ...users,
      {
        name: newName,
        designation: newDesignation,
        role: "Viewer",
        active: true,
      },
    ]);

    setNewName("");
    setNewDesignation("");
    Alert.alert("Success", "New user added with Viewer access");
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <Text style={styles.title}>Access Control Management</Text>

      {/* Users List */}
      <Text style={styles.sectionTitle}>Authorized Users</Text>

      {users.map((user, index) => (
        <View key={index} style={styles.userCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.designation}>{user.designation}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => changeRole(index)} style={styles.roleBtn}>
              <Text style={styles.roleText}>{user.role}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleAccess(index)}
              style={[
                styles.statusBtn,
                { backgroundColor: user.active ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              <Text style={{ color: user.active ? "#166534" : "#7f1d1d" }}>
                {user.active ? "Active" : "Blocked"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add User */}
      <View style={styles.addCard}>
        <Text style={styles.sectionTitle}>Add New Officer</Text>

        <TextInput
          placeholder="Full Name"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />

        <TextInput
          placeholder="Designation & Location"
          value={newDesignation}
          onChangeText={setNewDesignation}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addUser}>
          <Text style={styles.addText}>Grant Access</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 10,
  },
  userCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  name: {
    fontWeight: "bold",
    color: "#064e3b",
  },
  designation: {
    fontSize: 12,
    color: "#6b7280",
  },
  controls: {
    alignItems: "flex-end",
    gap: 8,
  },
  roleBtn: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  roleText: {
    color: "#1e40af",
    fontSize: 12,
    fontWeight: "600",
  },
  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addCard: {
    marginTop: 20,
    backgroundColor: "#f0fdfa",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccfbf1",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1fae5",
    padding: 12,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
