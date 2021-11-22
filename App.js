import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { LogBox, View } from 'react-native';
import colors from './constants/colors';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  LogBox.ignoreAllLogs()
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.dark} />
      <RootNavigator />
    </>
  );
}
