import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import AdminScreen from "./screens/AdminScreen";
import ClientScreen from "./screens/ClientScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(null); // Usuario actual
  const [role, setRole] = useState(null); // Rol del usuario
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      if (currentUser) {
        try {
          // Recuperar documento del usuario desde Firestore
          const userDocRef = doc(FIRESTORE_DB, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setRole(userData.role || null); // Verificar rol
          } else {
            console.error("No se encontró el documento del usuario.");
            setRole(null);
          }
          setUser(currentUser);
        } catch (error) {
          console.error("Error al recuperar el rol:", error);
          setRole(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false); // Terminar estado de carga
    });

    return unsubscribe;
  }, []);

  if (loading) return <LoadingScreen />; // Mostrar indicador de carga

  if (!user) {
    // Usuario no autenticado
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (role === "admin") {
    // Usuario administrador
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: "Gestión de Productos" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (role === "client") {
    // Usuario cliente
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Client"
          component={ClientScreen}
          options={{ title: "Carrito de Compras" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  // Rol no válido
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
        initialParams={{ errorMessage: "Rol no válido. Contacta al administrador." }}
      />
    </Stack.Navigator>
  );
}
