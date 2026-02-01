// /frontend/app/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI } from '../services/api'; 
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    location: ''
  });

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 1. Call the Backend
      const data = await AuthAPI.signup(form);
      
      // 2. Save Session Data
      await AsyncStorage.setItem('userToken', data.access_token);
      await AsyncStorage.setItem('userId', data.user_id.toString());
      await AsyncStorage.setItem('userRole', data.role);

      // 3. Navigate based on Role 
      Alert.alert("Success", "Account Created!");
      router.replace('/collector/collector_dashboard');
      
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Signup failed. Check internet.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join TraceRoots 🌱</Text>
      <Text style={styles.subtitle}>Create your farmer profile</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Full Name" 
          style={styles.input} 
          onChangeText={(t) => setForm({...form, full_name: t})}
        />
        <TextInput 
          placeholder="Username" 
          style={styles.input} 
          autoCapitalize="none"
          onChangeText={(t) => setForm({...form, username: t})}
        />
        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(t) => setForm({...form, email: t})}
        />
        <TextInput 
          placeholder="Password" 
          style={styles.input} 
          secureTextEntry
          onChangeText={(t) => setForm({...form, password: t})}
        />
        <TextInput 
          placeholder="Location (e.g., Punjab)" 
          style={styles.input} 
          onChangeText={(t) => setForm({...form, location: t})}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginBottom: 5, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  inputContainer: { gap: 15, marginBottom: 25 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  btn: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#2e7d32', fontWeight: '600' }
});