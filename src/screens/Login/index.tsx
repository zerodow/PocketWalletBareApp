import { useState } from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  TextView,
  InputField,
  BaseButton,
  SafeAreaWrapper,
} from '@/components';
import { authService } from '@/services/authService';
import { makeStyles } from '@/utils/makeStyles';
import { translate } from '@/i18n/translate';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const styles = useStyles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || translate('loginScreen.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const onMockLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.login('demo@pocketwallet.com', 'password123');
    } catch (err: any) {
      setError(err.message || translate('loginScreen.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TextView size="display" family="bold" style={styles.title}>
          {translate('loginScreen.title')}
        </TextView>
        <TextView size="title" style={styles.subTitle}>
          {translate('loginScreen.subtitle')}
        </TextView>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: translate('loginScreen.emailRequired'),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label={translate('loginScreen.emailLabel')}
                placeholder={translate('loginScreen.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                showClear
                onClear={() => onChange('')}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: translate('loginScreen.passwordRequired'),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label={translate('loginScreen.passwordLabel')}
                placeholder={translate('loginScreen.passwordPlaceholder')}
                type="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          {error && <TextView style={styles.errorText}>{error}</TextView>}

          <BaseButton
            text={isLoading ? translate('loginScreen.signingInButton') : translate('loginScreen.signInButton')}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
            style={styles.loginButton}
          />

          <BaseButton
            text={translate('loginScreen.quickDemoButton')}
            onPress={onMockLogin}
            disabled={isLoading}
            variant="outlined"
            style={styles.demoButton}
          />

          <TextView size="caption" style={styles.helpText}>
            {translate('loginScreen.helpText')}
          </TextView>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};
export default LoginScreen;
const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    opacity: 0.7,
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
  },
  demoButton: {
    marginTop: theme.spacing.sm,
  },
  helpText: {
    textAlign: 'center',
    opacity: 0.6,
  },
}));
