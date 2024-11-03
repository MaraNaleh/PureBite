import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';// Asegúrate de tener configurada la importación de Firebase correctamente

export default function MenuScreen({ navigation }) {
  const [orderedItems, setOrderedItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosCollection = collection(db, 'menuItems');
        const productosSnapshot = await getDocs(productosCollection);
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      } catch (error) {
        Alert.alert("Error al cargar productos", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleProductSelect = (product) => {
    navigation.navigate('ProductDetail', { 
      product: product, 
      orderedItems: orderedItems,
      setOrderedItems: setOrderedItems 
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const categories = [...new Set(productos.map(producto => producto.categoria))];

  return (
    <ScrollView style={styles.container}>
      {categories.map(category => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <FlatList
            horizontal
            data={productos.filter(producto => producto.categoria === category)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleProductSelect(item)}>
                <View style={styles.productCard}>
                  <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
                  <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.nombre}</Text>
                  <Text style={styles.productPrice}>{item.precio} Gs.</Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productCard: {
    marginRight: 15,
    width: 120,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 12,
    color: '#888',
  },
});
