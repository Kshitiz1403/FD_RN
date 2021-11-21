import { StatusBar } from 'expo-status-bar';
import React from 'react';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <>
    <StatusBar style="light"/>
    <RootNavigator/>
    </>
  );
}
