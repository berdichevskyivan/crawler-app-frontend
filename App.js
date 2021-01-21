import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import io from 'socket.io-client';
import { SERVER_URL } from './constants';

const socket = io(SERVER_URL);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" headerMode="none">
        <Stack.Screen 
          name="Auth"
          component={AuthScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
