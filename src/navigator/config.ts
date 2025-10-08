import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// Common screen options
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

// Auth stack specific options
export const authScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
};

// Main stack specific options
export const mainScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
};

// App stack specific options
export const appScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
};

// Bottom tab specific options
export const tabScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true,
};

// Screen Names
export const SCREEN_NAME = {
  // Auth Screens
  Login: 'Login' as const,
  Register: 'Register' as const,

  // Main Stack Screens
  TabNavigator: 'TabNavigator' as const,
  TransactionDetail: 'TransactionDetail' as const,
  Trash: 'Trash' as const,
  CategoryList: 'CategoryList' as const,
  CategoryEdit: 'CategoryEdit' as const,

  // Tab Screens
  HomeTab: 'HomeTab' as const,
  TransactionsTab: 'TransactionsTab' as const,
  AddTab: 'AddTab' as const,
  AnalyticsTab: 'AnalyticsTab' as const,
  SettingsTab: 'SettingsTab' as const,

  // App Stack Screens
  Main: 'Main' as const,
  Auth: 'Auth' as const,
};

// Exit routes for Android back button
export const exitRoutes = ['HomeTab', 'Login'];
