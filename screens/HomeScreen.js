import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation, route }) {
  const { role } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      {role === "admin" && (
        <Button
          title="Gestión de Productos"
          onPress={() => navigation.navigate("Admin")}
        />
      )}
      {role === "client" && (
        <Button
          title="Explorar Productos"
          onPress={() => navigation.navigate("Client")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
