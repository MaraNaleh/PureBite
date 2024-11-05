import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AdminMenu from '../AdminMenu';
import LoginScreen from '../LoginScreen';
import MainStack from '../MainStack';
import Top5Screen from '../Top5Screen';
import MenuScreen from '../MenuScreen';
import OrderSummaryScreen from '../OrderSummaryScreen'; // Importamos la pantalla de resumen de orden
import { Icon } from '@rneui/themed';

const Tab = createMaterialTopTabNavigator();

type HeaderProps = {
  onLoginPress: () => void;
  onOrderPress: () => void;
};

const Header: React.FC<HeaderProps> = ({ onLoginPress, onOrderPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>PureBite</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onOrderPress} style={styles.iconButton}>
          <Icon name="cart" type="ionicon" color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLoginPress} style={styles.iconButton}>
          <Icon name="log-in" type="ionicon" color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type RootStackParamList = {
  Todos: undefined;
  Menu: undefined;
  Top5: undefined;
  "Inicio de Sesion": undefined;
  AdminMenu: undefined;
  OrderSummaryScreen: undefined; // Añadimos la ruta del resumen de orden
};

const TabNavigator: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <>
      <Header
        onLoginPress={() => navigation.navigate('Inicio de Sesion')}
        onOrderPress={() => navigation.navigate('OrderSummaryScreen')} // Navegación al resumen de orden
      />
      <Tab.Navigator>
        <Tab.Screen
          name="Todos"
          component={MainStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="restaurant" type="ionicon" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="restaurant-menu" type="material" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Top5"
          component={Top5Screen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="star" type="ionicon" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Inicio de Sesion"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="log-in" type="ionicon" color={color} />
            ),
          }}
        />
                <Tab.Screen
          name="Orden"
          component={OrderSummaryScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="log-in" type="ionicon" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AdminMenu"
          component={AdminMenu}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="settings" type="ionicon" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#556B2F',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default TabNavigator;
