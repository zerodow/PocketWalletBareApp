// utils/makeStyles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import type { Theme } from '@/theme/createTheme';

/**
 * makeStyles nhận 1 callback: (theme: Theme) => StyleObject
 * và trả về 1 hook để dùng trong component.
 */
export const makeStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  styles: (theme: Theme) => T,
) => {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styles(theme));
  };
};
