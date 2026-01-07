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
  // If a developer passes plain text as a child like <Button>Save</Button>,
  // React Native will throw "Text strings must be rendered within a <Text> component.".
  // Ensure primitive children are wrapped with <Text> automatically.
  const renderChild = (child: any, index?: number) => {
    if (child === null || child === undefined) return null;
    if (typeof child === 'string' || typeof child === 'number') {
      return (
        <Text key={index}>
          {child}
        </Text>
      );
    }
    return child;
  };

  // Support array children too
  const content = Array.isArray(children)
    ? children.map((c, i) => renderChild(c, i))
    : renderChild(children as any);

  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      {content}
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
