import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

// Common screen options
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  // animation: "slide_from_right",
};

// Public stack specific options
export const publicScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
};

// App stack specific options
export const appScreenOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
};

// Bottom tab specific options
export const bottomTabOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: false,
};

export const SCREEN_NAME = {
  Login: 'Login',
};
