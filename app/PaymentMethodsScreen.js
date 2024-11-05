import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

const paymentMethods = [
  {
    id: '1',
    nombre: 'Tarjeta de Crédito',
    descripcion: 'Visa, Mastercard, American Express',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/visa-282255.png', // Logo de Visa
  },
  {
    id: '2',
    nombre: 'PayPal',
    descripcion: 'Paga de forma segura con tu cuenta de PayPal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', // Logo de PayPal
  },
  {
    id: '3',
    nombre: 'Transferencia Bancaria',
    descripcion: 'Transfiere directamente a nuestra cuenta',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/bank-1839105-1552248.png', // Icono genérico de banco
  },
  {
    id: '4',
    nombre: 'Efectivo',
    descripcion: 'Paga en efectivo al recibir tu pedido',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/cash-1911460-1615041.png', // Icono de efectivo
  },
];

const PaymentMethodsScreen = ({ navigation }) => {
  const handlePaymentSelect = (method) => {
    console.log('Método de pago seleccionado:', method);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.methodCard} onPress={() => handlePaymentSelect(item)}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={styles.methodDetails}>
        <Text style={styles.methodName}>{item.nombre}</Text>
        <Text style={styles.methodDescription}>{item.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Métodos de Pago</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  methodDescription: {
    fontSize: 14,
    color: '#888888',
  },
});

export default PaymentMethodsScreen;
