import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { db } from '../constants/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const currentUser = auth.currentUser;

export default function MainScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

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

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        return prevItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, cantidad: cartItem.cantidad + 1 } : cartItem
        );
      } else {
        // Si no, agregar el producto al carrito
        return [...prevItems, { ...item, cantidad: 1 }];
      }
    });

    // Calcular el nuevo total
    setTotal(prevTotal => prevTotal + item.precio);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
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

        {/* Lista de Todos los Productos */}
        <FlatList
          data={productos.filter(producto => producto.nombre.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              addToCart(item); // Agregar al carrito
              Alert.alert('Producto Agregado', `${item.nombre} ha sido agregado al carrito.`);
            }}>
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
                        color={i < item.favoritos ? '#556B2F' : '#ccc'}
                        size={15}
                      />
                    ))}
                  </View>
                  <Text style={styles.productPrice}>{item.precio} Gs.</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* Ícono Flotante del Carrito */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart', { cartItems, total })}
      >
        <Icon name="shopping-cart" type="font-awesome" color="#fff" size={30} />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6' },
  searchInput: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 16, marginHorizontal: 16 },
  top5Button: { backgroundColor: '#556B2F', padding: 10, borderRadius: 8, marginBottom: 16, alignItems: 'center', marginHorizontal: 16 },
  top5ButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  productCard: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, overflow: 'hidden', elevation: 2, marginHorizontal: 16 },
  productImage: { width: '100%', height: 150 },
  productInfo: { padding: 16 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', marginVertical: 8 },
  productPrice: { fontSize: 16, color: '#556B2F' },
  cartButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#556B2F',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
