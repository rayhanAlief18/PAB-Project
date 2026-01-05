// components/ui/gluestack-ui-components.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator as RNActivityIndicator,
  ViewProps,
  TextProps,
  TouchableOpacityProps,
} from 'react-native';

/**
 * Box
 */
export const Box: React.FC<ViewProps> = ({ children, ...props }) => {
  return <View {...props}>{children}</View>;
};

/**
 * Button
 */
export const Button: React.FC<TouchableOpacityProps> = ({
  children,
  ...props
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      {children}
    </TouchableOpacity>
  );
};

/**
 * ButtonText
 */
export const ButtonText: React.FC<TextProps> = ({
  children,
  ...props
}) => {
  return <Text {...props}>{children}</Text>;
};

/**
 * ActivityIndicator
 */
export const ActivityIndicator: React.FC<{ size?: 'small' | 'large' }> = ({
  size = 'small',
}) => {
  return <RNActivityIndicator size={size} />;
};
