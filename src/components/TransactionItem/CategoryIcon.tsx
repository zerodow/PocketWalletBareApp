import React from 'react';
import { View } from 'react-native';
import { TextView, Icon } from '@/components';
import { makeStyles } from '@/utils/makeStyles';

interface CategoryIconProps {
  icon?: string;
  color: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ icon, color }) => {
  const styles = useStyles();

  return (
    <View
      style={[
        styles.categoryIcon,
        {
          backgroundColor: color + '20',
          borderColor: color,
        },
      ]}
    >
      {icon ? (
        <TextView text={icon} size="title" />
      ) : (
        <Icon icon="menu" size={20} color={color} />
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
}));
