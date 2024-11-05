// components/ProductCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/styles';
import { FontAwesome } from '@expo/vector-icons';

export default function ProductCard({ product, onFavorite, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.imagenUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.nombre}</Text>
        <View style={styles.priceFavorite}>
          <Text style={styles.price}>{product.precio} Gs.</Text>
          <TouchableOpacity onPress={onFavorite}>
            <FontAwesome name="heart" size={24} color={colors.heart} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  priceFavorite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: colors.secondary,
  },
});
