import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TextInput, Button, StyleSheet } from "react-native";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";

export default function UserManagementScreen() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async () => {
    if (name && email && phone) {
      await addDoc(collection(FIRESTORE_DB, "users"), { name, email, phone });
      setName("");
      setEmail("");
      setPhone("");
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(FIRESTORE_DB, "users", id));
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Button title="Agregar Usuario" onPress={addUser} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>
            <Button title="Eliminar" onPress={() => deleteUser(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  userItem: { marginBottom: 20, padding: 15, backgroundColor: "#f9f9f9", borderRadius: 8 },
});
