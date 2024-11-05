import React from 'react';

import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';



export default function OrderSummaryScreen({ route, navigation }) {
  // Agrega un chequeo para evitar errores
  const orderedItems = route.params?.orderedItems || [];
  // Usa un valor por defecto

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.nombre}</Text>
      <Text style={styles.itemPrice}>{item.precio} Gs. x {item.cantidad}</Text>
      <Text style={styles.itemTotal}>Total: {item.precio * item.cantidad} Gs.</Text>
    </View>
  );

  const totalOrder = orderedItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Pedido</Text>
      {orderedItems.length > 0 ? (
        <>
          <FlatList
            data={orderedItems}
            keyExtractor={(item) => item.itemId}
            renderItem={renderItem}
          />
          <Text style={styles.total}>Total a Pagar: {totalOrder} Gs.</Text>
          <Button title="Realizar Pedido" onPress={() => {/* Aquí puedes manejar la creación del pedido en Firestore */}} />
        </>
      ) : (
        <Text>No hay items en el pedido.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F0EAD6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  itemContainer: { marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16 },
  itemTotal: { fontSize: 16, fontWeight: 'bold', color: '#FF6347' },
  total: { fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center' },
});

