import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CartScreen = ({ route, navigation }) => {
  const { cartItems, total } = route.params || { cartItems: [], total: 0 };

  const updateQuantity = (item, newQuantity) => {
    // Lógica para actualizar la cantidad en el carrito
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <Text style={styles.itemPrice}>{item.precio} Gs.</Text>
      <TextInput
        style={styles.quantityInput}
        keyboardType="numeric"
        value={item.cantidad.toString()}
        onChangeText={(text) => updateQuantity(item, parseInt(text))}
      />
      <Text style={styles.itemTotal}>{item.precio * item.cantidad} Gs.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {total} Gs.</Text>
      </View>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate("PaymentMethods")}
      >
        <Text style={styles.checkoutButtonText}>Proceder a Métodos de Pago</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0EAD6', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 },
  itemName: { fontSize: 18 },
  itemPrice: { fontSize: 16 },
  quantityInput: { width: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, textAlign: 'center' },
  itemTotal: { fontSize: 16, fontWeight: 'bold' },
  totalContainer: { marginTop: 20, padding: 16, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  totalText: { fontSize: 20, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#556B2F', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  checkoutButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default CartScreen;
