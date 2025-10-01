import { ReactNode } from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  MyInfor: undefined;
};

// Bottom Tab Navigator Types
export type BottomTabParamList = {
  Home: undefined;
  InventoryHubList: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

export interface TabBarItem {
  name: keyof BottomTabParamList;
  icon: (props: TabBarIconProps) => ReactNode;
  label: string;
  badge?: number;
  badgeColor?: string;
}

export type TabBarProps = {
  navigation: BottomTabNavigationProp<BottomTabParamList>;
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: keyof BottomTabParamList;
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

// App Stack Navigator Types
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
};

// Public Stack Navigator Types
export type PublicStackParamList = {
  Login: undefined;
};
