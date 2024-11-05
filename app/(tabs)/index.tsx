import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebaseConfig';

// Importa tus pantallas
import LoginScreen from '../LoginScreen';
import MenuScreen from '../MenuScreen';
import MainScreen from '../MainScreen';
import ProductDetailScreen from '../ProductDetailScreen';
import OrderSummaryScreen from '../OrderSummaryScreen';
import AdminMenu from '../AdminMenu';
import PaymentMethodsScreen from '../PaymentMethodsScreen';
import CartScreen from '../CartScreen';
import UserRegistration from '../UserRegistration';

const Stack = createStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserRole(docSnap.data().rol);
        }
      } else {
        setUserRole(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe(); // Asegúrate de limpiar la suscripción
  }, []);

  if (initializing) return null; // Muestra una pantalla de carga opcional

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userRole ? (
          // Si el usuario tiene un rol, redirige a MainScreen directamente
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
        ) : (
          // Navegación para el Login y Registro
          <>
            <Stack.Screen name="Inicio de Sesion" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="UserR" component={UserRegistration} options={{ headerShown: false }} />
          </>
        )}
        {userRole === 'admin' && (
          // Navegación para Admin
          <Stack.Group>
            <Stack.Screen name="AdminMenu" component={AdminMenu} options={{ headerShown: false }} />
            <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
              options={{ headerShown: false }}
              initialParams={{ isAdmin: true }} // Propiedad para identificar a los administradores
            />
          </Stack.Group>
        )}
        {userRole !== 'admin' && userRole !== null && (
          // Navegación para Cliente
          <Stack.Group>
            <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
              options={{ headerShown: false }}
              initialParams={{ isAdmin: false }} // Propiedad para identificar a los clientes
            />
            <Stack.Screen name="OrderSummaryScreen" component={OrderSummaryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ headerShown: false }} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
