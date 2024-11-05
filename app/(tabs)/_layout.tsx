import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebaseConfig';

import AdminMenu from '../AdminMenu';
import LoginScreen from '../LoginScreen';
import UserRegistration from '../UserRegistration'; // Asegúrate de importar el componente de registro
import MainStack from '../MainStack';
import Top5Screen from '../Top5Screen';
import MenuScreen from '../MenuScreen';
import OrderSummary from '../OrderSummaryScreen';
import { Icon } from '@rneui/themed';
import CartScreen from '../CartScreen';

const Tab = createMaterialTopTabNavigator();

type HeaderProps = {
  onLoginPress: () => void;
  onOrderPress: () => void;
  onLogoutPress?: () => void;
  isAuthenticated: boolean;
};

const Header: React.FC<HeaderProps> = ({ onLoginPress, onOrderPress, onLogoutPress, isAuthenticated }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>PureBite</Text>
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onOrderPress} style={styles.iconButton}>
        <Icon name="cart" type="ionicon" color="#FFFFFF" />
      </TouchableOpacity>
      {!isAuthenticated ? (
        <TouchableOpacity onPress={onLoginPress} style={styles.iconButton}>
          <Icon name="log-in" type="ionicon" color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onLogoutPress} style={styles.iconButton}>
          <Icon name="log-out" type="ionicon" color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

type RootStackParamList = {
  Todos: undefined;
  Menu: undefined;
  Top5: undefined;
  "Inicio de Sesion": undefined;
  "Registro de Usuario": undefined; // Añadir registro de usuario
  AdminMenu: undefined;
  Cart: undefined;
  UserR: undefined;
};

const TabNavigator: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserRole(docSnap.data().rol);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserRole(null);
      navigation.navigate('Inicio de Sesion');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (initializing) return null;

  return (
    <>
      <Header
        onLoginPress={() => navigation.navigate('Inicio de Sesion')}
        onOrderPress={() => navigation.navigate('Cart')}
        onLogoutPress={isAuthenticated ? handleLogout : undefined}
        onUserRegistrationPress={() => navigation.navigate('UserR')}
        isAuthenticated={isAuthenticated}
      />
      {isAuthenticated ? (
        <Tab.Navigator>
          {userRole === 'admin' ? (
            <>
              <Tab.Screen
                name="AdminMenu"
                component={AdminMenu}
                options={{
                  tabBarIcon: ({ color }) => (
                    <Icon name="settings" type="ionicon" color={color} />
                  ),
                }}
              />
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
            </>
          ) : (
            <>
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
            </>
          )}
        </Tab.Navigator>
      ) : (
        <>
          <LoginScreen /> 
        </>
      )}
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