import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { makeStyles } from '@/utils/makeStyles';

export interface ColorPickerProps {
  /**
   * Array of color hex strings to display
   */
  colors: string[];

  /**
   * Currently selected color
   */
  selectedColor: string;

  /**
   * Callback when a color is selected
   */
  onColorSelect: (color: string) => void;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  style,
}) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      {colors.map((color, index) => {
        const isSelected = selectedColor === color;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              isSelected && styles.colorOptionSelected,
            ]}
            onPress={() => onColorSelect(color)}
            activeOpacity={0.7}
          />
        );
      })}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    margin: theme.spacing.xxs,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: theme.colors.onBackground,
    transform: [{ scale: 1.1 }],
  },
}));
