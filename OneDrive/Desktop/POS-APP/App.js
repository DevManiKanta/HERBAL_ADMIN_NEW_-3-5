import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/store';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <RootNavigator />
    </AppProvider>
  );
}
