import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, Alert } from 'unikit';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home';
import Components from './screens/Components';
import Component from './screens/Component';

//const Box = styled.View((p) => ({ borderRadius: 25 + p.i, ml: p.i }));
const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  safeAreaInset: 'never',
};

const config = {
  screens: {
    Home: '',
    Components: 'components',
    Component: '/component/:slug',
  },
};

const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config,
};

export default function App() {
  return (
    <ThemeProvider
      mode="dark"
      theme={{
        colors: { backgroundDark: '#3F2D61' },
        Button: { rounded: true },
      }}
    >
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ ...screenOptions }}
          />
          <Stack.Screen
            name="Components"
            component={Components}
            options={{ ...screenOptions }}
          />
          <Stack.Screen
            name="Component"
            component={Component}
            options={{ ...screenOptions }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Alert />
    </ThemeProvider>
  );
}
