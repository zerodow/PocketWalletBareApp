import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PublicStackParamList } from './types';
import { publicScreenOptions, SCREEN_NAME } from './config';
import LoginScreen from '@/screens/Login';

const Stack = createNativeStackNavigator<PublicStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={publicScreenOptions}>
    <Stack.Screen name={SCREEN_NAME.Login} component={LoginScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
