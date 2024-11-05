import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../constants/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore'; // Asegúrate de importar getDoc

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validaciones de entrada
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const { rol } = userDoc.data();

        // Redirigir basado en el rol
        if (rol === 'cliente') {
          Alert.alert('Bienvenido', 'Inicio de sesión exitoso como Cliente');
          navigation.navigate('MainScreen'); // Navegar a la pantalla principal del cliente
        } else if (rol === 'admin') {
          Alert.alert('Bienvenido', 'Inicio de sesión exitoso como Administrador');
          navigation.navigate('AdminMenu'); // Navegar a la pantalla del administrador
        } else {
          Alert.alert('Error', 'Rol de usuario no válido.');
        }
      } else {
        Alert.alert('Error', 'No se encontró el rol del usuario.');
      }
    } catch (error) {
      console.error("Error en inicio de sesión:", error); // Imprimir el error en consola
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No hay ningún usuario registrado con este correo.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'La contraseña es incorrecta.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'El correo electrónico es inválido.');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado. Intenta nuevamente.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Éxito', 'Has cerrado sesión correctamente');
      navigation.navigate('LoginScreen'); // Navegar a la pantalla de login
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserRegistration')}>
        <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#556B2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#556B2F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: '#556B2F',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FF6347',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
