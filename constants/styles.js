// constants/styles.js
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#3B7A57', // verde principal
  secondary: '#F8B400', // naranja para precios y botones
  background: '#E5E5E5', // color de fondo claro
  text: '#333333', // color de texto
  heart: '#FF6B6B', // color de corazon para favoritos
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});
