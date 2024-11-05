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

    return unsubscribe;
  }, []);

  if (initializing) return null; // Muestra una pantalla de carga opcional

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userRole ? (
          userRole === 'admin' ? (
            // Navegación para Admin
            <Stack.Group>
              <Stack.Screen name="AdminMenu" component={AdminMenu} />
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen name="MenuScreen" component={MenuScreen} />
              <Stack.Screen
                name="ProductDetailScreen"
                component={ProductDetailScreen}
                initialParams={{ isAdmin: true }} // Propiedad para identificar a los administradores
              />
            </Stack.Group>
          ) : (
            // Navegación para Cliente
            <Stack.Group>
              <Stack.Screen name="MainScreen" component={MainScreen} />
              <Stack.Screen name="MenuScreen" component={MenuScreen} />
              <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} initialParams={{ isAdmin: false }} />
              <Stack.Screen name="OrderSummaryScreen" component={OrderSummaryScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="Paymentmethods" component={PaymentMethodsScreen} />
            </Stack.Group>
          )
        ) : (
          // Navegación para el Login
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
