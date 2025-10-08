import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { toastConfig } from '@/components';
import AppNavigator from '@/navigator/AppNavigator';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { initI18n } from '@/i18n';
import { loadDateFnsLocale } from '@/utils/formatDate';

const App = () => {
  const linking = {
    prefixes: ['pocketwallet://', 'https://pocketwallet.com'],
    config: {
      screens: {
        Auth: {
          screens: {
            Login: 'login',
            Register: 'register',
          },
        },
        Main: {
          screens: {
            TabNavigator: {
              screens: {
                HomeTab: 'home',
                TransactionsTab: 'transactions',
                AddTab: 'add',
                AnalyticsTab: 'analytics',
                SettingsTab: 'settings',
              },
            },
            TransactionDetail: 'transaction/:transactionId',
            CategoryList: 'categories',
            CategoryEdit: 'category/edit',
            Trash: 'trash',
          },
        },
      },
    },
  };

  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale());
  }, []);

  if (!isI18nInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <AppNavigator linking={linking} />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
