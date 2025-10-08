import React from 'react';
import { ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import { makeStyles } from '@/utils/makeStyles';
import { TextView } from '@/components/TextView';

export interface EmojiPickerProps {
  /**
   * Array of emoji strings to display
   */
  emojis: string[];

  /**
   * Currently selected emoji
   */
  selectedEmoji: string;

  /**
   * Callback when an emoji is selected
   */
  onEmojiSelect: (emoji: string) => void;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  emojis,
  selectedEmoji,
  onEmojiSelect,
  style,
}) => {
  const styles = useStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={[styles.scrollView, style]}
    >
      {emojis.map((emoji, index) => {
        const isSelected = selectedEmoji === emoji;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.emojiOption,
              isSelected && styles.emojiOptionSelected,
            ]}
            onPress={() => onEmojiSelect(emoji)}
            activeOpacity={0.7}
          >
            <TextView text={emoji} size="title" />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const useStyles = makeStyles(theme => ({
  scrollView: {
    flexGrow: 0,
  },
  contentContainer: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiOptionSelected: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
}));
