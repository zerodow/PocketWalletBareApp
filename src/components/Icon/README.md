# Icon Component

A flexible icon component that supports Ionicons vector icons, asset images, and local emoji/text icons.

## Usage

### Basic Usage (Ionicons - Default)

```tsx
import { Icon } from '@/components';

// Using mapped icon names
<Icon icon="home" size={24} color="#000" />
<Icon icon="settings" size={20} color="#666" />

// Using direct Ionicon names
<Icon icon="heart-outline" size={24} color="red" />
<Icon icon="star-sharp" size={32} color="gold" />
```

### Asset Icons (PNG Images)

```tsx
// Using asset images from src/assets/icons/
<Icon icon="home" size={24} type="asset" />
<Icon icon="settings" size={24} type="asset" />
<Icon icon="back" size={24} color="#000" type="asset" />
```

### Local Icons (Emoji/Text)

```tsx
// Using local emoji icons
<Icon icon="home" size={24} type="local" />
<Icon icon="transactions" size={24} type="local" />
```

## Props

| Prop    | Type                              | Default     | Description                               |
| ------- | --------------------------------- | ----------- | ----------------------------------------- |
| `icon`  | `string`                          | -           | Icon name (mapped or direct Ionicon name) |
| `size`  | `number`                          | `24`        | Icon size in pixels                       |
| `color` | `string`                          | -           | Icon color                                |
| `style` | `ViewStyle`                       | -           | Additional styles                         |
| `type`  | `'ionicon' \| 'asset' \| 'local'` | `'ionicon'` | Icon type to use                          |

## Available Mapped Icons

### Ionicons (type="ionicon" - default)

- `home` → `home-outline`
- `transactions` → `card-outline`
- `add` → `add`
- `analytics` → `analytics-outline`
- `settings` / `tabSettings` → `settings-outline`
- `back` → `arrow-back`
- `close` → `close`
- `search` → `search`
- `menu` → `menu`
- `more` → `ellipsis-horizontal`
- `edit` → `create-outline`
- `delete` → `trash-outline`
- `save` → `checkmark`
- `cancel` → `close`
- `info` → `information-circle-outline`
- `warning` → `warning-outline`
- `error` → `alert-circle-outline`
- `success` → `checkmark-circle-outline`

### Asset Icons (type="asset")

Available PNG icons from `src/assets/icons/`:

- `home`, `transactions`, `add`, `analytics`, `settings`
- `back`, `menu`, `more`, `check`, `x`
- `bell`, `caretLeft`, `caretRight`, `hidden`, `view`, `lock`
- `ladybug`

### Local Icons (type="local")

- `home` → 🏠
- `transactions` → 💳
- `add` → +
- `analytics` → 📊
- `settings` / `tabSettings` → ⚙️

## Examples

```tsx
// Tab navigation icons
<Icon icon="home" size={24} color={theme.colors.primary} />
<Icon icon="transactions" size={24} color={theme.colors.primary} />

// Action buttons
<Icon icon="edit" size={20} color="#007AFF" />
<Icon icon="delete" size={20} color="#FF3B30" />

// Status indicators
<Icon icon="success" size={16} color="#34C759" />
<Icon icon="error" size={16} color="#FF3B30" />

// Asset icons (PNG images)
<Icon icon="home" size={24} type="asset" />
<Icon icon="back" size={20} color="#007AFF" type="asset" />

// Custom Ionicon names
<Icon icon="heart-outline" size={24} color="red" />
<Icon icon="star-sharp" size={24} color="gold" />

// Local emoji fallback
<Icon icon="home" size={24} type="local" />
```

## Adding New Icons

### Adding Asset Icons

1. Add your PNG icon files to `src/assets/icons/` (with @2x and @3x variants for different screen densities)
2. Update `src/assets/index.ts` to include the new icon:

```tsx
const icons = {
  // ... existing icons
  newIcon: require('./icons/newIcon.png'),
};
```

### Adding Ionicon Mappings

Edit the `ioniconMap` in `src/components/Icon/index.tsx`:

```tsx
const ioniconMap: Record<string, string> = {
  // ... existing mappings
  newIcon: 'ionicon-name-here',
};
```

### Adding Local Icon Mappings

Edit the `localIconMap` in `src/components/Icon/index.tsx`:

```tsx
const localIconMap: Record<string, string> = {
  // ... existing mappings
  newIcon: '🆕',
};
```

## Notes

- **Ionicons** are vector-based and scale perfectly at any size
- **Asset icons** are PNG images that support color tinting and scale well
- **Local icons** use emoji/text and may not scale as well
- You can use any valid Ionicon name directly without mapping
- Asset icons fall back to Ionicons if the asset is not found
- The component falls back to '?' for local icons if not found
- Default type is 'ionicon' for better visual quality
- Asset icons support color tinting via the `color` prop
