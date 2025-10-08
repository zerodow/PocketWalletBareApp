import { View } from 'react-native';
import { TextView, SafeAreaWrapper, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface HomeScreenProps {
  // Add navigation props when needed
}

export default function HomeScreen({}: HomeScreenProps) {
  const styles = useStyles();

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          Home Screen
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          Main dashboard placeholder - implement your home screen content here
        </TextView>

        {/* Icon Examples */}
        <View style={styles.iconExamples}>
          <TextView size="title" style={styles.exampleTitle}>
            Icon Examples:
          </TextView>

          <View style={styles.iconRow}>
            <TextView size="body">Ionicons (default): </TextView>
            <Icon icon="home" size={24} color="#6C5CE7" />
            <Icon icon="heart-outline" size={24} color="#E74C3C" />
            <Icon icon="star" size={24} color="#F39C12" />
          </View>

          <View style={styles.iconRow}>
            <TextView size="body">Asset icons: </TextView>
            <Icon icon="home" size={24} type="asset" />
            <Icon icon="settings" size={24} type="asset" />
            <Icon icon="back" size={24} type="asset" />
          </View>

          <View style={styles.iconRow}>
            <TextView size="body">Local icons: </TextView>
            <Icon icon="home" size={24} type="local" />
            <Icon icon="transactions" size={24} type="local" />
            <Icon icon="analytics" size={24} type="local" />
          </View>
        </View>
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
    marginBottom: theme.spacing.xl,
    opacity: 0.7,
  },
  iconExamples: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  exampleTitle: {
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
}));
