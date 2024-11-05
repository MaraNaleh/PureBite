
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../constants/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Top5Screen({ navigation }) {
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProductos = async () => {
      try {
        const productosCollection = collection(db, 'menuItems');
        const productosSnapshot = await getDocs(productosCollection);
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filtra y ordena los productos por rating, luego toma los 5 mejores
        const sortedProductos = productosList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const top5 = sortedProductos.slice(0, 5);

        console.log('Top 5 Productos:', top5); // Verifica los datos aquí
        setTopProductos(top5);
      } catch (error) {
        Alert.alert("Error al cargar productos", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProductos();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 Productos</Text>

      <FlatList
        data={topProductos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <View style={styles.productCard}>
              {item.imagenUrl ? (
                <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
              ) : (
                <Text style={styles.noImageText}>Sin Imagen</Text>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre || 'Sin nombre'}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={{ color: i < (item.rating || 0) ? '#FFD700' : '#ccc' }}>★</Text>
                  ))}
                </View>
                <Text style={styles.productPrice}>{item.precio ? `${item.precio} Gs.` : 'Sin precio'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  productCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10 },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  noImageText: { width: 80, height: 80, textAlign: 'center', textAlignVertical: 'center', color: '#ccc' },
  productInfo: { marginLeft: 10, flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', marginTop: 4 },
  productPrice: { fontSize: 14, color: '#FF6347', marginTop: 4 },
});
