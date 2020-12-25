import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, showAlert, Alert } from 'unikit';
import { AppContextProvider, useAppContext } from './AppContext';

import Home from './screens/Home';
import Template from './screens/Template';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
  safeAreaInset: 'never',
};

function AppLayout() {
  const { dark } = useAppContext();
  const linking = {
    prefixes: ['https://unikit.netlify.de'],
    config: {
      screens: {
        Unikit: {
          path: '/',
        },
        Template: {
          path: '/component/:slug',
        },
      },
    },
  };

  React.useEffect(() => {
    // showAlert({
    //   key: 'test',
    //   confirm: true,
    //   message: 'test',
    //   onConfirm: () => {
    //     showAlert({
    //       key: 'test',
    //       loading: true,
    //       message: 'loading',
    //       confirm: false,
    //     });
    //     setTimeout(() => {
    //       showAlert({
    //         key: 'test',
    //         type: 'success',
    //         message: 'success',
    //         loading: false,
    //         timeout: 1000,
    //       });
    //     }, 2000);
    //   },
    // });
  });

  return (
    <NavigationContainer
      linking={linking}
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? (route?.params?.slug || 'Home')} - Unikit`,
      }}
    >
      <ThemeProvider mode={dark ? 'dark' : 'basic'} theme={{}}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              ...screenOptions,
            }}
          />
          <Stack.Screen
            name="Template"
            component={Template}
            options={{
              ...screenOptions,
            }}
          />
        </Stack.Navigator>

        <Alert />
      </ThemeProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <AppLayout />
    </AppContextProvider>
  );
}
