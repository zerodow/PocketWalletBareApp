import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles } from '@/utils/makeStyles';

interface SafeAreaWrapperProps {
  children: ReactNode;
  top?: boolean;
  bottom?: boolean;
  style?: ViewStyle;
}

export const SafeAreaWrapper = ({
  children,
  top = true,
  bottom = true,
  style,
}: SafeAreaWrapperProps) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top ? insets.top : 0,
          paddingBottom: bottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
  },
}));
