import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { db } from '../constants/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProductDetailScreen({ route, navigation }) {
  const { product, userId } = route.params;
  const [rol, setRol] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingPromedio, setRatingPromedio] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [disponible, setDisponible] = useState(product.disponible);

  useEffect(() => {
    const obtenerRol = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setRol(userDoc.data().rol);
        } else {
          console.log('No se encontró el documento del usuario');
        }
      } catch (error) {
        console.error("Error obteniendo rol del usuario: ", error);
      }
    };

    obtenerRol();
    setRatingPromedio(product.ratingPromedio || 0);
    setFavoriteCount(product.favoriteCount || 0);
  }, [product, userId]);

  const toggleFavorite = async () => {
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    Alert.alert(newIsFavorite ? "Producto agregado a favoritos" : "Producto quitado de favoritos");
    setFavoriteCount(favoriteCount + (newIsFavorite ? 1 : -1));
  };
  

  const handleRating = (value) => {
    setRating(value);
    Alert.alert(`Calificación: ${value} corazones`);
    setRatingPromedio((prev) => (prev * favoriteCount + value) / (favoriteCount + 1));
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !disponible;
      const productRef = doc(db, 'menuItems', product.id);
      await setDoc(productRef, { disponible: newAvailability }, { merge: true });
      setDisponible(newAvailability);
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
        {disponible && <Text style={styles.availability}>Disponible</Text>}
      </View>
      <View style={styles.details}>
        <Text style={styles.productPrice}>{product.precio} Gs.</Text>
        <Text style={styles.productCategory}>{product.categoria}</Text>
        <Text style={styles.productDescription}>{product.descripcion}</Text>

        {rol === 'cliente' && (
          <>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Icon
                name={isFavorite ? "heart" : "heart-o"}
                type="font-awesome"
                color="red"
                size={30}
              />
            </TouchableOpacity>
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
          </>
        )}

        {rol === 'admin' && (
          <>
            <Button
              title={disponible ? "Deshabilitar Producto" : "Habilitar Producto"}
              onPress={toggleAvailability}
              color="#FF6347"
            />
            <Text style={styles.adminText}>Promedio de calificación: {ratingPromedio.toFixed(1)} / 5</Text>
            <Text style={styles.adminText}>Veces marcado como favorito: {favoriteCount}</Text>
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
  adminText: { fontSize: 16, color: '#FF6347', marginVertical: 5 },
  backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: '#FF6347', borderRadius: 30, padding: 10 },
});
