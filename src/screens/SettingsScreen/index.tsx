import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface SettingsScreenProps {
  // Add navigation props when needed
}

export default function SettingsScreen({}: SettingsScreenProps) {
  const styles = useStyles();

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          Settings
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          App settings placeholder - implement your settings options here
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
}));
