import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { db } from '../constants/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener este paquete instalado

export default function Top5Screen({ navigation }) {
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    const fetchTopProductos = async () => {
      try {
        const productosCollection = collection(db, 'menuItems');
        const productosSnapshot = await getDocs(productosCollection);
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const sortedProductos = productosList.sort((a, b) => (b.favoritos || 0) - (a.favoritos || 0));
        const top5 = sortedProductos.slice(0, 5);

        setTopProductos(top5);
      } catch (error) {
        Alert.alert("Error al cargar productos", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProductos();

    return () => unsubscribe();
  }, []);

  const handleProductSelect = (product) => {
    if (!currentUser) {
      Alert.alert("Error", "Debes iniciar sesión para continuar.");
      return;
    }

    navigation.navigate('ProductDetail', { 
      product: product, 
      userId: currentUser.uid 
    });
  };

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
          <TouchableOpacity onPress={() => handleProductSelect(item)}>
            <View style={styles.productCard}>
              {item.imagenUrl ? (
                <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
              ) : (
                <View style={styles.noImagePlaceholder}>
                  <Text style={styles.noImageText}>Sin Imagen</Text>
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre || 'Sin nombre'}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="heart" size={18} color={i < (item.favoritos || 0) ? '#FF6347' : '#ccc'} />
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  productCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#F9F9F9', borderRadius: 8, padding: 10, elevation: 1 },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  noImagePlaceholder: { 
    width: 80, 
    height: 80, 
    backgroundColor: '#ccc', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  noImageText: { textAlign: 'center', color: '#fff' },
  productInfo: { marginLeft: 10, flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', marginTop: 4 },
  productPrice: { fontSize: 14, color: '#FF6347', marginTop: 4 },
});
