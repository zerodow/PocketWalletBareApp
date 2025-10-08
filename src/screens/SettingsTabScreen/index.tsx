import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';

import { TextView, SafeAreaWrapper, BaseButton } from '@/components';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';
import { settingsService } from '@/services/settingsService';
import { useAppStore } from '@/store/appStore';
import { DatabaseQueries } from '@/database/queries';
import { resetService } from '@/services/resetService';
import {
  SettingsSection,
  SettingsRow,
  SettingsChip,
  SettingsChipRow,
} from './components';

interface SettingsTabScreenProps {
  // Add navigation props when needed
}

const SettingsTabScreen: FC<SettingsTabScreenProps> = ({}) => {
  const styles = useStyles();

  // Subscribe to store state for reactive updates
  const themeMode = useAppStore(state => state.themeMode);
  const language = useAppStore(state => state.language);
  const currencyCode = useAppStore(state => state.currencyCode);
  const defaultTxType = useAppStore(state => state.defaultTxType);

  const [txCount, setTxCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);

  useEffect(() => {
    const loadCounts = async () => {
      const [cats, recentTx] = await Promise.all([
        DatabaseQueries.getCategories(),
        DatabaseQueries.getRecentTransactions(1000000), // use large limit to approximate count
      ]);
      setCategoryCount(cats.length);
      setTxCount(recentTx.length);
    };
    loadCounts();
  }, []);

  const onChangeTheme = useCallback((mode: 'light' | 'dark' | 'system') => {
    settingsService.setThemeMode(mode);
  }, []);

  const onChangeLanguage = useCallback((lng: string) => {
    settingsService.setLanguage(lng);
    const languageName = lng === 'en' ? 'English' : 'Tiếng Việt';
    Alert.alert(
      translate('settingsScreen.language'),
      translate('settingsScreen.languageChanged', { language: languageName }),
    );
  }, []);

  const onChangeCurrency = useCallback((code: string) => {
    settingsService.setCurrency(code);
    Alert.alert(
      translate('settingsScreen.currency'),
      translate('settingsScreen.currencyChanged', { currency: code }),
    );
  }, []);

  const onChangeDefaultTxType = useCallback((type: 'income' | 'expense') => {
    settingsService.setDefaultTxType(type);
  }, []);

  const appInfo = useMemo(() => {
    return {
      name: 'Pocket Wallet',
      version: '1.0.0',
      build: '1',
    };
  }, []);

  const handleClearCache = useCallback(async () => {
    Alert.alert(
      translate('settingsScreen.clearCacheTitle'),
      translate('settingsScreen.clearCacheMessage'),
      [
        { text: translate('common.cancel'), style: 'cancel' },
        {
          text: translate('settingsScreen.clearCache'),
          style: 'destructive',
          onPress: async () => {
            await resetService.clearCacheSafe();
            Alert.alert(
              translate('common.ok'),
              translate('settingsScreen.clearCacheSuccess'),
            );
          },
        },
      ],
    );
  }, []);

  const handleResetApp = useCallback(async () => {
    Alert.alert(
      translate('settingsScreen.resetAppTitle'),
      translate('settingsScreen.resetAppMessage'),
      [
        { text: translate('common.cancel'), style: 'cancel' },
        {
          text: translate('settingsScreen.resetApp'),
          style: 'destructive',
          onPress: async () => {
            await resetService.fullReset();
            Alert.alert(
              translate('settingsScreen.resetAppTitle'),
              translate('settingsScreen.resetAppSuccess'),
            );
          },
        },
      ],
    );
  }, []);

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TextView size="display" family="bold" style={styles.title}>
            {translate('settingsScreen.title')}
          </TextView>
          <TextView size="body" style={styles.subtitle}>
            {translate('settingsScreen.subtitle')}
          </TextView>
        </View>

        {/* App Preferences */}
        <SettingsSection title={translate('settingsScreen.appPreferences')}>
          <SettingsRow label={translate('settingsScreen.theme')}>
            <SettingsChipRow>
              {(['system', 'light', 'dark'] as const).map(mode => (
                <SettingsChip
                  key={mode}
                  label={translate(
                    `settingsScreen.theme${
                      mode.charAt(0).toUpperCase() + mode.slice(1)
                    }` as any,
                  )}
                  isSelected={themeMode === mode}
                  onPress={() => onChangeTheme(mode)}
                />
              ))}
            </SettingsChipRow>
          </SettingsRow>

          <SettingsRow label={translate('settingsScreen.language')}>
            <SettingsChipRow>
              {(['en', 'vi'] as const).map(lng => (
                <SettingsChip
                  key={lng}
                  label={translate(
                    `settingsScreen.language${
                      lng === 'en' ? 'English' : 'Vietnamese'
                    }` as any,
                  )}
                  isSelected={language === lng}
                  onPress={() => onChangeLanguage(lng)}
                />
              ))}
            </SettingsChipRow>
          </SettingsRow>

          <SettingsRow label={translate('settingsScreen.currency')}>
            <SettingsChipRow>
              {(['VND', 'USD', 'EUR'] as const).map(code => (
                <SettingsChip
                  key={code}
                  label={code}
                  isSelected={currencyCode === code}
                  onPress={() => onChangeCurrency(code)}
                />
              ))}
            </SettingsChipRow>
          </SettingsRow>

          <SettingsRow
            label={translate('settingsScreen.defaultTransactionType')}
          >
            <SettingsChipRow>
              {(['expense', 'income'] as const).map(type => (
                <SettingsChip
                  key={type}
                  label={translate(
                    `settingsScreen.transactionType${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    }` as any,
                  )}
                  isSelected={defaultTxType === type}
                  onPress={() => onChangeDefaultTxType(type)}
                />
              ))}
            </SettingsChipRow>
          </SettingsRow>
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection title={translate('settingsScreen.privacySecurity')}>
          <SettingsRow label={translate('settingsScreen.appLock')}>
            <Switch value={false} disabled />
          </SettingsRow>
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title={translate('settingsScreen.dataManagement')}>
          <TextView size="body" style={styles.dataStats}>
            {translate('settingsScreen.dataStats', { categoryCount, txCount })}
          </TextView>

          <View style={styles.buttonRow}>
            <BaseButton
              text={translate('settingsScreen.clearCache')}
              onPress={handleClearCache}
              variant="outlined"
              size="medium"
            />
            <BaseButton
              text={translate('settingsScreen.resetApp')}
              onPress={handleResetApp}
              variant="outlined"
              size="medium"
            />
          </View>
        </SettingsSection>

        {/* Sync Placeholder */}
        <SettingsSection title={translate('settingsScreen.sync')}>
          <TextView size="body" style={styles.muted}>
            {translate('settingsScreen.syncDescription')}
          </TextView>
        </SettingsSection>

        {/* About */}
        <SettingsSection title={translate('settingsScreen.about')}>
          <TextView size="body" style={styles.muted}>
            {translate('settingsScreen.appInfo', {
              name: appInfo.name,
              version: appInfo.version,
              build: appInfo.build,
            })}
          </TextView>
        </SettingsSection>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SettingsTabScreen;

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    color: theme.colors.onBackground,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.textDim,
  },
  dataStats: {
    color: theme.colors.textDim,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  muted: {
    color: theme.colors.textDim,
  },
}));
