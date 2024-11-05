import React, { useState } from 'react'; 
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../constants/firebaseConfig'; // Importa tu configuración de Firebase
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params; // Obtiene el producto a editar
  const [nombre, setNombre] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [precio, setPrecio] = useState(product.precio.toString()); // Convertir a string para TextInput
  const [categoria, setCategoria] = useState(product.categoria);
  const [disponible, setDisponible] = useState(product.disponible);

  const handleSave = async () => {
    // Validación simple
    if (!nombre || !descripcion || !precio || !categoria) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    // Conversión del precio
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum)) {
      Alert.alert("Error", "El precio debe ser un número válido");
      return;
    }

    try {
      // Asegúrate de que product.id es el ID generado por Firebase
      const productRef = doc(db, 'menuItems', product.id); // Usa el ID generado por Firebase
      await setDoc(productRef, { 
        nombre, 
        descripcion, 
        precio: precioNum, 
        categoria, 
        disponible 
      }, { merge: true });
      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      console.error("Error actualizando el producto: ", error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: async () => {
            try {
              const productRef = doc(db, 'menuItems', product.id); // Usa el ID generado por Firebase
              await deleteDoc(productRef); // Elimina el documento
              Alert.alert("Éxito", "Producto eliminado correctamente");
              navigation.goBack(); // Regresa a la pantalla anterior
            } catch (error) {
              console.error("Error eliminando el producto: ", error);
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
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
      <Button title="Eliminar Producto" onPress={handleDelete} color="#FF0000" />
      
      {/* Botón de regresar */}
      <Button title="Regresar" onPress={() => navigation.goBack()} color="#556B2F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 },
});
