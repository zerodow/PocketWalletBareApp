import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { navigationRef } from './src/navigator/navigationUtilities';
import React from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { StatusBar, View } from 'react-native';

import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { toastConfig } from '@/components';
import AppNavigator from '@/navigator/AppNavigator';
import { ThemeProvider } from '@/theme/ThemeProvider';

const App = () => {
  const linking = {
    prefixes: ['tkg-props://', 'https://tkg-props.com'],
    config: {
      screens: {
        Login: 'login',
        DetailNews: 'detailNews/:id',
      },
    },
  };

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <NavigationContainer
            ref={navigationRef as React.Ref<NavigationContainerRef<any>>}
            linking={linking}
            fallback={<View />}
            onReady={() => {}}
          >
            <AppNavigator />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
