import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Icon } from '@rneui/themed';

export default function ProductDetailScreen({ route, navigation }) {
  const { product, orderedItems, setOrderedItems } = route.params; // Recibe items ordenados y función para actualizarlos
  const [cantidad, setCantidad] = useState(1);

  const incrementarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };
  const handleOrder = () => {
    const itemPedido = {
      itemId: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad,
    };
  
    Alert.alert(
      'Confirmación',
      `¿Quieres ordenar ${cantidad} de ${product.nombre} por un total de ${itemPedido.precio * cantidad} Gs.?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => {
            setOrderedItems((prevItems) => {
              const updatedItems = [...prevItems];
              const existingItemIndex = updatedItems.findIndex(item => item.itemId === itemPedido.itemId);
              
              if (existingItemIndex !== -1) {
                updatedItems[existingItemIndex].cantidad += cantidad;
              } else {
                updatedItems.push(itemPedido);
              }
              
              // Navegar a la pantalla de resumen de pedidos con los items actualizados
              navigation.navigate('OrderSummary', { orderedItems: updatedItems });
              return updatedItems;
            });
          },
        },
      ]
    );
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: product.imagenUrl }} style={styles.productImage} />
        {product.disponible && <Text style={styles.availability}>Disponible</Text>}
      </View>
      <View style={styles.details}>
        <Text style={styles.productPrice}>{product.precio} Gs.</Text>
        <Text style={styles.productCategory}>{product.categoria}</Text>
        <Text style={styles.productDescription}>{product.descripcion}</Text>
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
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantity: { fontSize: 20, marginHorizontal: 10 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
});
