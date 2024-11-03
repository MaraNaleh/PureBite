import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import ProductDetailScreen from './ProductDetailScreen';
import OrderSummary from './OrderSummaryScreen'; // Importa OrderSummary
import PaymentMethods from './PaymentMethodsScreen'; // Importa PaymentMethods

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}
