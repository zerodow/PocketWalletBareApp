import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import {
  TransactionDetailScreen,
  TrashScreen,
  CategoryListScreen,
  CategoryEditScreen,
} from '@/screens';
import { useTheme } from '@/theme';
import { MainStackParamList } from './types';
import { mainScreenOptions, SCREEN_NAME } from './config';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...mainScreenOptions,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
      initialRouteName={SCREEN_NAME.TabNavigator}
    >
      <Stack.Screen name={SCREEN_NAME.TabNavigator} component={TabNavigator} />
      <Stack.Screen
        name={SCREEN_NAME.TransactionDetail}
        component={TransactionDetailScreen}
      />
      <Stack.Screen name={SCREEN_NAME.Trash} component={TrashScreen} />
      <Stack.Screen
        name={SCREEN_NAME.CategoryList}
        component={CategoryListScreen}
      />
      <Stack.Screen
        name={SCREEN_NAME.CategoryEdit}
        component={CategoryEditScreen}
      />
    </Stack.Navigator>
  );
}
