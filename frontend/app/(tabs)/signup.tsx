import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSignup = () => {
    // Later connect to backend
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Select Role</Text>
      {["Collector", "Processor", "Regulator", "Consumer"].map((r) => (
        <TouchableOpacity
          key={r}
          style={styles.roleButton}
          onPress={() => setRole(r)}
        >
          <Text style={role === r ? styles.roleTextActive : styles.roleText}>{r}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#374151",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 15,
  },
  roleButton: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  roleText: {
    color: "#374151",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#15803d",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#15803d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#15803d",
    marginTop: 15,
    textAlign: "center",
  },
});
