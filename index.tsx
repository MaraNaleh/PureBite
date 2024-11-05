import React from 'react';
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import AppNavigator from './app/(tabs)/index';

const App = () => {
  return <AppNavigator />;
};

registerRootComponent(App);

