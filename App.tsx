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
import { useAppStore } from '@/store/appStore';
import type { ColorMode } from '@/theme';
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
  const themeMode = useAppStore(state => state.themeMode);

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale());
  }, []);

  if (!isI18nInitialized) {
    return null;
  }

  // Determine the theme mode to pass to ThemeProvider
  const forceMode: ColorMode | undefined =
    themeMode === 'system' ? undefined : themeMode;

  // Determine status bar style based on theme mode
  const statusBarStyle =
    forceMode === 'dark' ? 'light-content' : 'dark-content';

  return (
    <GestureHandlerRootView>
      <ThemeProvider forceMode={forceMode}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={statusBarStyle}
          />
          <AppNavigator linking={linking} />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
