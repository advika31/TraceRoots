// /frontend/app/(tabs)/signup.tsx

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import API from "@/services/api";

export default function Signup() {
  const [walletAddress, setWalletAddress] = useState("");
  const [location, setLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

 const handleSignup = async () => {
    Alert.alert("Signup button clicked"); 
  if (role !== "Collector") {
    Alert.alert("Only Collector signup is enabled right now");
    return;
  }

  try {
    await API.post("/farmers/register", {
  name,
  location,
  farm_size: Number(farmSize),
  wallet_address: walletAddress,
});

   Alert.alert(
  "Registration Successful",
  `Your wallet address is:\n\n${walletAddress}\n\nPlease use this to login.`
);


    router.replace("/login");
  } catch (error: any) {
  console.log("Signup error FULL:", error);
  console.log("Signup error RESPONSE:", error?.response);
  console.log("Signup error DATA:", error?.response?.data);

  Alert.alert(
    "Signup Failed",
    JSON.stringify(error?.response?.data || error.message)
  );
}
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

      <Text style={styles.label}>Wallet Address</Text>
<TextInput
  style={styles.input}
  placeholder="Enter wallet address"
  value={walletAddress}
  onChangeText={setWalletAddress}
/>

<Text style={styles.label}>Location</Text>
<TextInput
  style={styles.input}
  placeholder="Enter farm location"
  value={location}
  onChangeText={setLocation}
/>

<Text style={styles.label}>Farm Size (in acres)</Text>
<TextInput
  style={styles.input}
  placeholder="Enter farm size"
  keyboardType="numeric"
  value={farmSize}
  onChangeText={setFarmSize}
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
