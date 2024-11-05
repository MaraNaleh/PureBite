import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../constants/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminMenu() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const handleAddProduct = async () => {
    // Validación simple
    if (!nombre || !categoria|| !descripcion || !precio || !imagenUrl) {
      Alert.alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "menuItems"), {
        nombre,
        categoria,
        descripcion,
        precio: parseFloat(precio),
        imagenUrl,
      });
      Alert.alert("Producto agregado con éxito!");
      // Limpiar los campos después de agregar el producto
      setNombre('');
      setCategoria('');
      setDescripcion('');
      setPrecio('');
      setImagenUrl('');
    } catch (error) {
      Alert.alert("Error al agregar el producto: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={categoria}
        onChangeText={setCategoria}
      />
            <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric" // Para asegurar que el teclado muestre números
      />
      <TextInput
        style={styles.input}
        placeholder="URL de Imagen"
        value={imagenUrl}
        onChangeText={setImagenUrl}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
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
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
