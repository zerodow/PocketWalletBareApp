import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';

import {
  HomeScreen,
  AnalyticsTabScreen,
  QuickAddScreen,
  TransactionsTabScreen,
  SettingsTabScreen,
} from '@/screens';
import { Icon } from '@/components';
import { useTheme } from '@/theme';
import { makeStyles } from '@/utils/makeStyles';
import type { TabParamList } from './types';
import { tabScreenOptions, SCREEN_NAME } from './config';

const Tab = createBottomTabNavigator<TabParamList>();

// Icon components to avoid inline function creation
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon icon="home" size={size} color={color} type="ionicon" />
);
const TransactionsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon icon="transactions" size={size} color={color} type="ionicon" />
);
const AnalyticsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon icon="analytics" size={size} color={color} type="ionicon" />
);
const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon icon="tabSettings" size={size} color={color} type="ionicon" />
);

// Center tab icon component
const CenterTabIcon = ({ focused }: { focused: boolean }) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View
      style={[
        styles.centerTabContainer,
        focused && styles.centerTabContainerFocused,
      ]}
    >
      <Icon
        icon="add"
        size={24}
        color={theme.colors.onPrimary}
        type="ionicon"
        style={{ transform: [{ rotate: '45deg' }] }}
      />
    </View>
  );
};

// Center tab button wrapper
const CenterTabButton = ({ children }: { children: React.ReactNode }) => {
  const styles = useStyles();
  return <View style={styles.centerTabButton}>{children}</View>;
};

export function TabNavigator() {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        ...tabScreenOptions,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface + '80', // 50% opacity
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name={SCREEN_NAME.HomeTab}
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
          tabBarAccessibilityLabel: 'Home tab, 1 of 5',
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME.TransactionsTab}
        component={TransactionsTabScreen}
        options={{
          title: 'Transactions',
          tabBarIcon: TransactionsIcon,
          tabBarAccessibilityLabel: 'Transactions tab, 2 of 5',
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME.AddTab}
        component={QuickAddScreen}
        options={{
          title: '',
          tabBarIcon: CenterTabIcon,
          tabBarButton: CenterTabButton,
          tabBarAccessibilityLabel: 'Add new transaction, center tab, 3 of 5',
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME.AnalyticsTab}
        component={AnalyticsTabScreen}
        options={{
          title: 'Analytics',
          tabBarIcon: AnalyticsIcon,
          tabBarAccessibilityLabel: 'Analytics tab, 4 of 5',
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME.SettingsTab}
        component={SettingsTabScreen}
        options={{
          title: 'Settings',
          tabBarIcon: SettingsIcon,
          tabBarAccessibilityLabel: 'Settings tab, 5 of 5',
        }}
      />
    </Tab.Navigator>
  );
}

const useStyles = makeStyles(theme => ({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.sm : theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    height: Platform.OS === 'ios' ? 84 : 64,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: theme.typography.family.medium,
    marginTop: 2,
  },
  centerTabContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  centerTabContainerFocused: {
    backgroundColor: theme.colors.primary,
  },
  centerTabButton: {
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
