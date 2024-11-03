// app/PaymentMethods.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PaymentMethodsScreen = ({ route, navigation }) => {
  const { total } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métodos de Pago</Text>
      <TouchableOpacity style={styles.methodButton}>
        <Text style={styles.methodText}>Tarjeta de Crédito</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.methodButton}>
        <Text style={styles.methodText}>Efectivo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.methodButton}>
        <Text style={styles.methodText}>Pago Electrónico</Text>
      </TouchableOpacity>
      <Text style={styles.totalText}>Total a Pagar: {total} Gs.</Text>
      <TouchableOpacity
        style={styles.finalizeButton}
        onPress={() => alert('Pedido Finalizado')}
      >
        <Text style={styles.finalizeButtonText}>Finalizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F0EAD6' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' },
  methodButton: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginVertical: 8, alignItems: 'center', elevation: 2 },
  methodText: { fontSize: 18, color: '#333' },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#556B2F', marginTop: 16, textAlign: 'center' },
  finalizeButton: { backgroundColor: '#556B2F', padding: 10, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  finalizeButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default PaymentMethodsScreen;
