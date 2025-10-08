import { View } from 'react-native';
import { TextView, SafeAreaWrapper } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface AnalyticsTabScreenProps {
  // Add navigation props when needed
}

const AnalyticsTabScreen = ({}: AnalyticsTabScreenProps) => {
  const styles = useStyles();

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {translate('dashboardScreen.title')}
        </TextView>
        <TextView size="body" style={styles.subtitle}>
          {translate('dashboardScreen.subtitle')}
        </TextView>
      </View>
    </SafeAreaWrapper>
  );
};

export default AnalyticsTabScreen;

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
