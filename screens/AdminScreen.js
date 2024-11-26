import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function AdminScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para agregar un nuevo producto
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(FIRESTORE_DB, "products"), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
      });
      Alert.alert("Éxito", "Producto agregado correctamente.");
      setNewProduct({ name: "", price: "" });
      fetchProducts(); // Recargar productos
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el producto.");
    }
  };

  // Función para editar un producto
  const handleEditProduct = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const productDoc = doc(FIRESTORE_DB, "products", editingProduct.id);
      await updateDoc(productDoc, {
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
      });
      Alert.alert("Éxito", "Producto actualizado correctamente.");
      setEditingProduct(null);
      fetchProducts(); // Recargar productos
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      const productDoc = doc(FIRESTORE_DB, "products", id);
      await deleteDoc(productDoc);
      Alert.alert("Éxito", "Producto eliminado correctamente.");
      fetchProducts(); // Recargar productos
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el producto.");
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
      <Text style={styles.title}>Gestión de Productos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={editingProduct ? editingProduct.name : newProduct.name}
        onChangeText={(text) =>
          editingProduct
            ? setEditingProduct({ ...editingProduct, name: text })
            : setNewProduct({ ...newProduct, name: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        value={editingProduct ? editingProduct.price : newProduct.price}
        onChangeText={(text) =>
          editingProduct
            ? setEditingProduct({ ...editingProduct, price: text })
            : setNewProduct({ ...newProduct, price: text })
        }
      />
      {editingProduct ? (
        <TouchableOpacity style={styles.button} onPress={handleEditProduct}>
          <Text style={styles.buttonText}>Actualizar Producto</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingProduct(item)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item.id)}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9F2B68",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#AAB7B8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FDFEFE",
    fontSize: 16,
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
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#F1C40F",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#6C3483",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
