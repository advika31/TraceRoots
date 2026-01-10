// frontend/app/components/Navbar.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Image
        source={require("../../assets/logo_2.png")} // 🔹 Put your logo inside assets folder
        style={styles.logo}
      />
      <Text style={styles.title}>TraceRoots</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c8f7daff",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#166534",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 60,
    marginRight: 5,
    marginLeft: -20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
  },
});
