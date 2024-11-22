import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Button, StyleSheet } from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, "cart"));
    setCartItems(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addToCart = async (itemName) => {
    await addDoc(collection(FIRESTORE_DB, "cart"), { name: itemName, quantity: 1 });
    fetchCartItems();
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <Text>Cantidad: {item.quantity}</Text>
          </View>
        )}
      />
      <Button title="Agregar Producto de Prueba" onPress={() => addToCart("Producto Prueba")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  cartItem: { marginBottom: 20, padding: 15, backgroundColor: "#f9f9f9", borderRadius: 8 },
});
