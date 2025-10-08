import { useEffect } from 'react';
import { ComponentProps } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useTheme } from '@/theme';
import { useAppStore } from '@/store/appStore';
import { appInitService } from '@/services/appInitService';
import { AppStackParamList } from './types';
import { appScreenOptions, exitRoutes, SCREEN_NAME } from './config';
import {
  navigationRef,
  useBackButtonHandler,
  useNavigationPersistence,
} from './navigationUtilities';

const Stack = createNativeStackNavigator<AppStackParamList>();

export interface NavigationProps
  extends Partial<
    ComponentProps<typeof NavigationContainer<AppStackParamList>>
  > {}

export default function AppNavigator(props: NavigationProps) {
  const theme = useTheme();

  // Use separate selectors to avoid re-render issues
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const isHydrated = useAppStore(state => state.isHydrated);

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  // Navigation persistence
  const { onNavigationStateChange, isRestored, initialNavigationState } =
    useNavigationPersistence('navigation-state');

  // Initialize app state from storage on mount
  useEffect(() => {
    const initialize = async () => {
      await appInitService.initializeApp();
    };
    initialize();
  }, []);

  if (!isHydrated || !isRestored) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.onSurface,
          border: theme.colors.outline,
          notification: theme.colors.error,
        },
        fonts: {
          regular: {
            fontFamily: theme.typography.family.regular,
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: theme.typography.family.medium,
            fontWeight: '500',
          },
          bold: {
            fontFamily: theme.typography.family.bold,
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: theme.typography.family.bold,
            fontWeight: '900',
          },
        },
      }}
      initialState={initialNavigationState}
      onStateChange={onNavigationStateChange}
      key={`auth-${isAuthenticated}`}
      {...props}
    >
      <Stack.Navigator screenOptions={appScreenOptions}>
        {isAuthenticated ? (
          <Stack.Screen name={SCREEN_NAME.Main} component={MainNavigator} />
        ) : (
          <Stack.Screen name={SCREEN_NAME.Auth} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
