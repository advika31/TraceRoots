import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const processorCredentials = {
    email: "processor@example.com",
    password: "123",
  };
  const collectorCredentials = {
    email: "Collector@example.com",
    password: "123",
  };
  const handleLogin = () => {
    if (role === "Processor") {
      // Check email and password for Processor
      if (email === processorCredentials.email && password === processorCredentials.password) {
        router.push("/processor/processor_dashboard");
      } else {
        Alert.alert("Invalid Processor credentials");
      }
    }
    else if (role === "Collector") {
      if (email === collectorCredentials.email && password === collectorCredentials.password) {
        router.push("/collector/collector_dashboard");
      } else {
        Alert.alert("Invalid Collector credentials");
      }
    }
    else if (role === "Regulator") router.push("/regulator/regulator_dashboard");
    else if (role === "Consumer") router.push("/consumer/consumer_dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AyurPramaan Login</Text>

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
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => setRole("Collector")}
      >
        <Text style={role === "Collector" ? styles.roleTextActive : styles.roleText}>
          Collector
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => setRole("Processor")}
      >
        <Text style={role === "Processor" ? styles.roleTextActive : styles.roleText}>
          Processor
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => setRole("Regulator")}
      >
        <Text style={role === "Regulator" ? styles.roleTextActive : styles.roleText}>
          Regulator
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => setRole("Consumer")}
      >
        <Text style={role === "Consumer" ? styles.roleTextActive : styles.roleText}>
          Consumer
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
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
