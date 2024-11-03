import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { db } from '../constants/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function MainScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['Todos', 'Ensaladas', 'Tartas', 'Postres'];

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Barra de Navegación de Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Barra de Búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Botón para ver el Top 5 */}
      <TouchableOpacity style={styles.top5Button} onPress={() => navigation.navigate('Top5')}>
        <Text style={styles.top5ButtonText}>Ver Top 5 Productos</Text>
      </TouchableOpacity>

      {/* Lista de Productos */}
      <FlatList
        data={productos.filter(producto => producto.nombre.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <View style={styles.productCard}>
              <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                
                {/* Corazones verdes como calificación */}
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="heart"
                      type="font-awesome"
                      color={i < item.favoritos ? '#556B2F' : '#ccc'} // Verde oliva oscuro para seleccionados, gris para no seleccionados
                      size={15}
                    />
                  ))}
                </View>

                <Text style={styles.productPrice}>{item.precio} Gs.</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6', paddingHorizontal: 16 }, // Verde oliva suave
  categoryBar: { flexDirection: 'row', marginBottom: 16 },
  categoryButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#556B2F', borderRadius: 20, marginRight: 8 },
  categoryText: { color: '#FFFFFF', fontWeight: 'bold' },
  searchInput: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 16 },
  top5Button: { backgroundColor: '#556B2F', padding: 10, borderRadius: 8, marginBottom: 16, alignItems: 'center' },
  top5ButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  list: { paddingVertical: 16 },
  productCard: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 16, overflow: 'hidden', elevation: 2 },
  productImage: { width: '100%', height: 150 },
  productInfo: { padding: 16 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', marginVertical: 8 },
  productPrice: { fontSize: 16, color: '#556B2F' },
});
