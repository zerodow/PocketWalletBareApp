import { View, Text } from 'react-native';
import React from 'react';
import { makeStyles } from '@/utils/makeStyles';

const Login = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
};

export default Login;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.surface, // ✅ IntelliSense gợi ý
    padding: theme.spacing.md, // ✅ type number
    borderRadius: theme.radius.lg,
    elevation: theme.elevation.level2,
  },
  title: {
    color: theme.colors.onSurface,
    fontFamily: theme.typography.family.semiBold,
    fontSize: theme.typography.size.title,
  },
}));
