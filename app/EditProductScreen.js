import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { db } from '../constants/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function EditProductScreen({ route, navigation }) {
  const { product, isAdmin } = route.params; // Obtener el producto y el estado de admin
  const [nombre, setNombre] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [precio, setPrecio] = useState(product.precio.toString());
  const [categoria, setCategoria] = useState(product.categoria);
  const [disponible, setDisponible] = useState(product.disponible);

  const handleSave = async () => {
    if (!nombre || !descripcion || !precio || !categoria) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      Alert.alert("Error", "El precio debe ser un número válido");
      return;
    }

    try {
      const productRef = doc(db, 'menuItems', product.itemId);
      await setDoc(productRef, { 
        nombre, 
        descripcion, 
        precio: precioNum, 
        categoria, 
        disponible 
      }, { merge: true });
      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error actualizando el producto: ", error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>

      {/* Mostrar la imagen del producto si es modo admin */}
      {isAdmin && product.imagenUrl && (
        <Image source={{ uri: product.imagenUrl }} style={styles.productImage} />
      )}

      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del producto"
      />
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
      />
      <TextInput
        style={styles.input}
        value={precio}
        keyboardType="numeric"
        onChangeText={setPrecio}
        placeholder="Precio"
      />
      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Categoría"
      />
      <Button
        title={disponible ? "Deshabilitar Producto" : "Habilitar Producto"}
        onPress={() => setDisponible(!disponible)}
        color="#FF6347"
      />
      <Button title="Guardar" onPress={handleSave} color="#556B2F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 16 
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});
