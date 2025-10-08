import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { authScreenOptions, SCREEN_NAME } from './config';
import { LoginScreen, RegisterScreen } from '@/screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={authScreenOptions}
      initialRouteName={SCREEN_NAME.Login}
    >
      <Stack.Screen name={SCREEN_NAME.Login} component={LoginScreen} />
      <Stack.Screen name={SCREEN_NAME.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
}
