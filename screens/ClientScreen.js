import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function ClientScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const userId = FIREBASE_AUTH.currentUser?.uid; // Obtener el ID del usuario actual

  // Función para cargar productos desde Firestore
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos.");
    }
  };

  // Función para cargar el carrito del usuario actual desde Firestore
  const fetchCart = async () => {
    try {
      const cartRef = collection(FIRESTORE_DB, "cart");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const cartArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(cartArray);
      calculateTotal(cartArray);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el carrito.");
    }
  };

  // Calcular el total del carrito
  const calculateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Función para agregar un producto al carrito
  const handleAddToCart = async (product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      const cartDoc = doc(FIRESTORE_DB, "cart", existingItem.id);
      await updateDoc(cartDoc, {
        quantity: existingItem.quantity + 1,
      });
      fetchCart();
    } else {
      await addDoc(collection(FIRESTORE_DB, "cart"), {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        userId: userId,
      });
      fetchCart();
    }
  };

  // Función para decrementar un producto en el carrito
  const handleRemoveFromCart = async (product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem.quantity === 1) {
      const cartDoc = doc(FIRESTORE_DB, "cart", existingItem.id);
      await deleteDoc(cartDoc);
      fetchCart();
    } else {
      const cartDoc = doc(FIRESTORE_DB, "cart", existingItem.id);
      await updateDoc(cartDoc, {
        quantity: existingItem.quantity - 1,
      });
      fetchCart();
    }
  };

  // Función para vaciar el carrito
  const handleClearCart = async () => {
    try {
      const cartRef = collection(FIRESTORE_DB, "cart");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const batch = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(batch);
      setCart([]);
      setTotal(0);
    } catch (error) {
      Alert.alert("Error", "No se pudo vaciar el carrito.");
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Disponibles</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.buttonText}>Agregar al Carrito</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.productName}>
              {item.name} x{item.quantity}
            </Text>
            <Text style={styles.productPrice}>
              ${item.price * item.quantity}
            </Text>
            <View style={styles.cartActions}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleRemoveFromCart(item)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
        <Text style={styles.clearText}>Vaciar Carrito</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F7F7F7" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9F2B68",
    marginBottom: 20,
    textAlign: "center",
  },
  product: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C39BD3",
    borderRadius: 8,
    backgroundColor: "#F9EBEA",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#512E5F",
  },
  productPrice: {
    fontSize: 16,
    color: "#2874A6",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#9B59B6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  cartItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C39BD3",
    borderRadius: 8,
    backgroundColor: "#F9EBEA",
  },
  cartActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: "#9B59B6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 40,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#512E5F",
  },
  clearButton: {
    backgroundColor: "#E74C3C",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  clearText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#6C3483",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
