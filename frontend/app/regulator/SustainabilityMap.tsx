// app/regulator/SustainabilityMap.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polygon, Region } from "react-native-maps";

export default function SustainabilityMap() {
  const [region, setRegion] = useState<Region>({
    latitude: 28.6139, // Default: New Delhi
    longitude: 77.209,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  // Example zones (Green, Yellow, Red)
  const zones = [
    {
      name: "Sustainable Zone",
      color: "rgba(34,197,94,0.3)", // green
      coords: [
        { latitude: 28.65, longitude: 77.15 },
        { latitude: 28.65, longitude: 77.25 },
        { latitude: 28.55, longitude: 77.25 },
        { latitude: 28.55, longitude: 77.15 },
      ],
    },
    {
      name: "Moderate Zone",
      color: "rgba(250,204,21,0.3)", // yellow
      coords: [
        { latitude: 28.70, longitude: 77.20 },
        { latitude: 28.70, longitude: 77.30 },
        { latitude: 28.60, longitude: 77.30 },
        { latitude: 28.60, longitude: 77.20 },
      ],
    },
    {
      name: "Restricted Zone",
      color: "rgba(209, 13, 13, 0.3)", // red
      coords: [
        { latitude: 28.55, longitude: 77.18 },
        { latitude: 28.55, longitude: 77.28 },
        { latitude: 28.45, longitude: 77.28 },
        { latitude: 28.45, longitude: 77.18 },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {/* Zones */}
        {zones.map((zone, index) => (
          <Polygon
            key={index}
            coordinates={zone.coords}
            fillColor={zone.color}
            strokeColor={zone.color}
          />
        ))}

        {/* Marker for user location */}
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="You are here"
          description="Current Location"
        />
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Zone Meaning:</Text>
        <Text>🟢 Sustainable Zone</Text>
        <Text>🟡 Moderate Zone</Text>
        <Text>🔴 Restricted Zone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#166534",
  },
});
