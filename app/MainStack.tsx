import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import ProductDetailScreen from './ProductDetailScreen';
import OrderSummary from './OrderSummaryScreen'; // Importa OrderSummary
import PaymentMethods from './PaymentMethodsScreen'; // Importa PaymentMethods
import CartScreen from './CartScreen';
import LoginScreen from './LoginScreen';
import EditProductScreen from './EditProductScreen';
import UserRegistration from './UserRegistration';
const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={MainScreen}options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen}options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={CartScreen}options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods}options={{ headerShown: false }} />
      <Stack.Screen name="Inicio de Sesion" component={LoginScreen}options={{ headerShown: false }} />
      <Stack.Screen name="EditProduct" component={EditProductScreen}options={{ headerShown: false }} />
      <Stack.Screen name="UserR" component={UserRegistration}options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
