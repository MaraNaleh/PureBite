import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from '@rneui/themed';

import { db } from '../constants/firebaseConfig'; // Importa tu configuración de Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Asegúrate de importar setDoc

export default function ProductDetailScreen({ route, navigation }) {
  const { product, userId } = route.params; // Recibe 'product' y 'userId' desde las rutas
  const [rol, setRol] = useState(''); // Estado para el rol
  const [cantidad, setCantidad] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingPromedio, setRatingPromedio] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [disponible, setDisponible] = useState(product.disponible); // Añadir estado para la disponibilidad

  useEffect(() => {
    // Obtener el rol del usuario desde Firestore
    const obtenerRol = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId)); // Cambia 'Usuarios' al nombre de tu colección
      if (userDoc.exists()) {
        setRol(userDoc.data().rol); // Asumiendo que el campo 'rol' existe en tu colección
      } else {
        console.log('No se encontró el documento del usuario');
      }
    };

    obtenerRol();
    
    // Simulación de carga de datos de calificación y favoritos
    setRatingPromedio(product.ratingPromedio || 0);
    setFavoriteCount(product.favoriteCount || 0);
  }, [product, userId]);

  const incrementarCantidad = () => setCantidad(cantidad + 1);
  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(isFavorite ? "Producto quitado de favoritos" : "Producto agregado a favoritos");
    if (!isFavorite) setFavoriteCount(favoriteCount + 1);
  };

  const handleRating = (value) => {
    setRating(value);
    Alert.alert(`Calificación: ${value} corazones`);
    setRatingPromedio((prev) => (prev * favoriteCount + value) / (favoriteCount + 1));
  };

  

  const toggleAvailability = async () => {
    try {
      const newAvailability = !disponible; // Cambia el estado de disponibilidad
      const productRef = doc(db, 'menuItems', product.id); // Usa el ID generado por Firebase
      await setDoc(productRef, { disponible: newAvailability }, { merge: true }); // Actualiza solo el campo de disponibilidad
      setDisponible(newAvailability); // Actualiza el estado local
      Alert.alert("Éxito", `Producto ${newAvailability ? 'habilitado' : 'deshabilitado'} correctamente`);
    } catch (error) {
      console.error("Error cambiando la disponibilidad: ", error);
      Alert.alert("Error", "No se pudo cambiar la disponibilidad del producto");
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditProduct', { product });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: product.imagenUrl }} style={styles.productImage} />
        {disponible && <Text style={styles.availability}>Disponible</Text>} {/* Usa el estado disponible */}
      </View>
      <View style={styles.details}>
        <Text style={styles.productPrice}>{product.precio} Gs.</Text>
        <Text style={styles.productCategory}>{product.categoria}</Text>
        <Text style={styles.productDescription}>{product.descripcion}</Text>

        {rol === 'cliente' && (
          <>
            {/* Funcionalidad de Favoritos */}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Icon
                name={isFavorite ? "heart" : "heart-o"}
                type="font-awesome"
                color="red"
                size={30}
              />
            </TouchableOpacity>

            {/* Calificación */}
            <Text>Calificación:</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity key={value} onPress={() => handleRating(value)}>
                  <Icon
                    name={value <= rating ? "heart" : "heart-o"}
                    type="font-awesome"
                    color="red"
                    size={24}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Cantidad y Botón de Ordenar */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decrementarCantidad}>
                <Icon name="remove-circle" type="ionicon" color="#FF6347" size={30} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{cantidad}</Text>
              <TouchableOpacity onPress={incrementarCantidad}>
                <Icon name="add-circle" type="ionicon" color="#FF6347" size={30} />
              </TouchableOpacity>
            </View>
            <Button title="Ordenar" onPress={handleOrder} color="#FF6347" />
          </>
        )}

        {rol === 'admin' && (
          <>
            {/* Funciones adicionales para Admin */}
            <Button
              title={disponible ? "Deshabilitar Producto" : "Habilitar Producto"}
              onPress={toggleAvailability} // Llama a la nueva función al presionar el botón
              color="#FF6347"
            />
            <Text style={styles.adminText}>Promedio de calificación: {ratingPromedio.toFixed(1)} / 5</Text>
            <Text style={styles.adminText}>Veces marcado como favorito: {favoriteCount}</Text>

            {/* Botón para editar detalles del producto */}
            <Button title="Editar Producto" onPress={handleEdit} color="#556B2F" />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" type="ionicon" color="#FFFFFF" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6' },
  header: { alignItems: 'center', backgroundColor: '#556B2F', paddingVertical: 20 },
  productImage: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: '#FFFFFF' },
  availability: { marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  details: { flex: 1, padding: 20, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  productPrice: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  productCategory: { fontSize: 18, fontWeight: 'bold', color: '#556B2F', marginBottom: 10 },
  productDescription: { fontSize: 16, color: '#666', marginBottom: 20 },
  favoriteButton: { alignItems: 'center', marginBottom: 10 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantity: { fontSize: 20, marginHorizontal: 10 },
  adminText: { fontSize: 16, color: '#FF6347', marginVertical: 5 },
  backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: '#FF6347', borderRadius: 30, padding: 10 },
});
