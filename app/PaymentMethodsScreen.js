import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, Alert } from 'react-native';

const paymentMethods = [
  {
    id: '1',
    nombre: 'Tarjeta de Crédito',
    descripcion: 'Visa, Mastercard, American Express',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/visa-282255.png',
  },
  {
    id: '2',
    nombre: 'PayPal',
    descripcion: 'Paga de forma segura con tu cuenta de PayPal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  },
  {
    id: '3',
    nombre: 'Transferencia Bancaria',
    descripcion: 'Transfiere directamente a nuestra cuenta',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/bank-1839105-1552248.png',
  },
  {
    id: '4',
    nombre: 'Efectivo',
    descripcion: 'Paga en efectivo al recibir tu pedido',
    icon: 'https://cdn.iconscout.com/icon/free/png-256/cash-1911460-1615041.png',
  },
];

const PaymentMethodsScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiration: '', cvv: '' });
  const [transferInfo, setTransferInfo] = useState({ phoneNumber: '', amount: '' });

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleFinalizePurchase = () => {
    Alert.alert(
      "Compra finalizada",
      "Compra finalizada con éxito",
      [
        {
          text: "Aceptar",
          onPress: () => navigation.navigate('MainScreen'), // Cambia 'MainScreen' al nombre real de tu pantalla principal
        }
      ]
    );
  };

  const renderPaymentForm = () => {
    switch (selectedMethod?.id) {
      case '1': // Tarjeta de Crédito
      case '2': // PayPal
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Detalles de Pago</Text>
            {selectedMethod.id === '1' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Número de Tarjeta"
                  value={cardDetails.number}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Fecha de Expiración (MM/AA)"
                  value={cardDetails.expiration}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, expiration: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                />
              </>
            )}
            {selectedMethod.id === '2' && (
              <Text>Inicia sesión en tu cuenta de PayPal para completar el pago.</Text>
            )}
          </View>
        );
      case '3': // Transferencia Bancaria
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Datos de Transferencia</Text>
            <Text>Cuenta: 123456789</Text>
            <Text>Nombre del Banco: Banco Ejemplo</Text>
            <Text>Por favor, envía el comprobante a: 0987654321</Text>
            <TextInput
              style={styles.input}
              placeholder="Monto a Transferir"
              value={transferInfo.amount}
              onChangeText={(text) => setTransferInfo({ ...transferInfo, amount: text })}
            />
          </View>
        );
      case '4': // Efectivo
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Pago en Efectivo</Text>
            <Text>Paga en efectivo al recibir tu pedido.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Métodos de Pago</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.methodCard} onPress={() => handlePaymentSelect(item)}>
            <Image source={{ uri: item.icon }} style={styles.icon} />
            <View style={styles.methodDetails}>
              <Text style={styles.methodName}>{item.nombre}</Text>
              <Text style={styles.methodDescription}>{item.descripcion}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
      {selectedMethod && (
        <>
          {renderPaymentForm()}
          <TouchableOpacity
            style={styles.finalizeButton}
            onPress={handleFinalizePurchase}
          >
            <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    padding: 16,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#556B2F',
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
  formContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20, // Espacio entre formularios
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15, // Espacio entre inputs
    paddingHorizontal: 10,
  },
  finalizeButton: {
    backgroundColor: '#556B2F',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default PaymentMethodsScreen;
