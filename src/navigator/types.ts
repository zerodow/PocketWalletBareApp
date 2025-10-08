import { ReactNode } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack Navigator Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Tab Navigator Types
export type TabParamList = {
  HomeTab: undefined;
  TransactionsTab: undefined;
  AddTab: undefined;
  AnalyticsTab: undefined;
  SettingsTab: undefined;
};

// Main Stack Navigator Types
export type MainStackParamList = {
  TabNavigator: undefined;
  TransactionDetail: { transactionId: string };
  Trash: undefined;
  CategoryList: undefined;
  CategoryEdit: { categoryId?: string; isIncome: boolean };
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

// Tab Screen Props (composite with Main Stack)
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabNavigationProp<TabParamList, T>,
  MainStackScreenProps<keyof MainStackParamList>
>;

// App Stack Navigator Types (Root)
export type AppStackParamList = {
  Main: undefined;
  Auth: undefined;
};

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

// Tab Bar Types
export type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export interface TabBarItem {
  name: keyof TabParamList;
  icon: (props: TabBarIconProps) => ReactNode;
  label: string;
  badge?: number;
  badgeColor?: string;
}

export type TabBarProps = {
  navigation: BottomTabNavigationProp<TabParamList>;
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: keyof TabParamList;
    }>;
  };
};

export type TabBarButtonProps = {
  item: TabBarItem;
  isFocused: boolean;
  onPress: () => void;
  accessibilityState: {
    selected: boolean;
  };
};

// Legacy types for backward compatibility
export type PublicStackParamList = AuthStackParamList;
export type BottomTabParamList = TabParamList;
