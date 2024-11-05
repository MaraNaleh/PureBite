import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CartScreen = ({ route, navigation }) => {
  const { cartItems } = route.params || { cartItems: [] };
  const [cart, setCart] = useState(cartItems);

  const updateQuantity = (item, newQuantity) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.id === item.id ? { ...cartItem, cantidad: newQuantity } : cartItem
    );
    setCart(updatedCart);
  };

  const changeQuantity = (item, change) => {
    const newQuantity = item.cantidad + change;
    if (newQuantity >= 0) {
      updateQuantity(item, newQuantity);
    }
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter(cartItem => cartItem.id !== itemId);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.itemPrice}>{item.precio} Gs.</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => changeQuantity(item, -1)} style={styles.quantityButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={item.cantidad.toString()}
            onChangeText={(text) => updateQuantity(item, parseInt(text) || 0)}
          />
          <TouchableOpacity onPress={() => changeQuantity(item, 1)} style={styles.quantityButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotal}>{item.precio * item.cantidad} Gs.</Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Quitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Carrito de Compras</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: {calculateTotal()} Gs.</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  listContainer: { paddingBottom: 16 },
  cartItem: { 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    elevation: 2, 
    marginBottom: 20, // Espacio entre elementos
  },
  itemName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  detailsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemPrice: { 
    fontSize: 16, 
    marginRight: 8 
  },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 8 
  },
  quantityInput: { 
    width: 50, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 4, 
    textAlign: 'center', 
    marginHorizontal: 8,
    padding: 0,
  },
  quantityButton: { 
    backgroundColor: '#556B2F', 
    padding: 8, 
    borderRadius: 4 
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
  itemTotal: { 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  totalContainer: { 
    marginTop: 20, 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    alignItems: 'center',
    elevation: 2,
  },
  totalText: { fontSize: 20, fontWeight: 'bold' },
  checkoutButton: { 
    backgroundColor: '#556B2F', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20 
  },
  checkoutButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  removeButton: { 
    marginTop: 10, 
    backgroundColor: '#FF6347', 
    padding: 8, 
    borderRadius: 4 
  },
  removeButtonText: { color: '#FFFFFF', fontWeight: 'bold' },

  backButtonText: { color: '#556B2F', fontWeight: 'bold' },
});

export default CartScreen;
