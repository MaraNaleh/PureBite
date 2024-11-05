import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AdminMenu from '../AdminMenu.js';
import LoginScreen from '../LoginScreen.js';
import MainScreen from '../MainScreen.js';
import Top5Screen from '../Top5Screen.js';
import MenuScreen from '../MenuScreen.js';
import ProductDetailScreen from '../ProductDetailScreen.js';
import Layout from './_layout';
import OrderSummaryScreen from '../OrderSummaryScreen';
import PaymentMethods from '../PaymentMethodsScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="AdminMenu" component={AdminMenu} />
        <Stack.Screen name="Inicio de Sesion" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Top5" component={Top5Screen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
