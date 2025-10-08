import { View, ViewStyle, Image } from 'react-native';
import { TextView } from '@/components/TextView';
import Ionicons from '@react-native-vector-icons/ionicons';
import { makeStyles } from '@/utils/makeStyles';
import { icons } from '@/assets';

interface IconProps {
  icon: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  type?: 'ionicon' | 'local' | 'asset';
}

/**
 * Icon component that supports Ionicons, local emoji/text icons, and asset images
 *
 * @example
 * // Using Ionicons (default)
 * <Icon icon="home" size={24} color="#000" />
 *
 * // Using asset images
 * <Icon icon="home" size={24} type="asset" />
 *
 * // Using local emoji icons
 * <Icon icon="home" size={24} color="#000" type="local" />
 *
 * // Using custom Ionicon name directly
 * <Icon icon="heart-outline" size={24} color="red" />
 */

// Local icon mapping using text/emoji
const localIconMap: Record<string, string> = {
  home: '🏠',
  transactions: '💳',
  add: '+',
  analytics: '📊',
  tabSettings: '⚙️',
  settings: '⚙️',
};

// Ionicons mapping - maps our icon names to Ionicons names
const ioniconMap: Record<string, string> = {
  home: 'home-outline',
  transactions: 'card-outline',
  add: 'add',
  plus: 'add-circle-outline',
  minus: 'remove-circle-outline',
  caretUp: 'caret-up',
  caretDown: 'caret-down',
  analytics: 'analytics-outline',
  tabSettings: 'settings-outline',
  settings: 'settings-outline',
  // Common icons
  back: 'arrow-back',
  close: 'close',
  search: 'search',
  menu: 'menu',
  more: 'ellipsis-horizontal',
  edit: 'create-outline',
  delete: 'trash-outline',
  save: 'checkmark',
  cancel: 'close',
  info: 'information-circle-outline',
  warning: 'warning-outline',
  error: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
};

export function Icon({
  icon,
  size = 24,
  color,
  style,
  type = 'ionicon',
}: IconProps) {
  const styles = useStyles();

  if (type === 'ionicon') {
    const ioniconName = ioniconMap[icon] || icon;

    return (
      <Ionicons
        name={ioniconName as any}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  if (type === 'asset') {
    const assetSource = icons[icon as keyof typeof icons];

    if (!assetSource) {
      // Fallback to ionicon if asset not found
      const ioniconName = ioniconMap[icon] || icon;
      return (
        <Ionicons
          name={ioniconName as any}
          size={size}
          color={color}
          style={style}
        />
      );
    }

    const containerStyle = [
      styles.container,
      {
        width: size,
        height: size,
      },
      style,
    ];

    const imageStyle = [
      styles.image,
      {
        width: size,
        height: size,
        tintColor: color,
      },
    ];

    return (
      <View style={containerStyle}>
        <Image source={assetSource} style={imageStyle} />
      </View>
    );
  }

  // Fallback to local emoji/text icons
  const iconText = localIconMap[icon] || '?';

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
    },
    style,
  ];

  const textStyle = [
    styles.text,
    {
      fontSize: size * 0.8,
      color: color,
      lineHeight: size,
    },
  ];

  return (
    <View style={containerStyle}>
      <TextView style={textStyle}>{iconText}</TextView>
    </View>
  );
}

const useStyles = makeStyles(_theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
}));
