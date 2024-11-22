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
      // Incrementar la cantidad en el carrito
      const cartDoc = doc(FIRESTORE_DB, "cart", existingItem.id);
      await updateDoc(cartDoc, {
        quantity: existingItem.quantity + 1,
      });
      fetchCart();
    } else {
      // Agregar un nuevo producto al carrito
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
      // Eliminar el producto del carrito si la cantidad es 1
      const cartDoc = doc(FIRESTORE_DB, "cart", existingItem.id);
      await deleteDoc(cartDoc);
      fetchCart();
    } else {
      // Decrementar la cantidad
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
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  product: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  productName: { fontSize: 18, fontWeight: "bold" },
  productPrice: { fontSize: 16, color: "#555", marginBottom: 10 },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  cartItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  cartActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cartButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 40,
  },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 20, textAlign: "center" },
  clearButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  clearText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
