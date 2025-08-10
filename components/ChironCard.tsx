import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChironCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "small" | "medium" | "large";
}

export function ChironCard({
  children,
  onPress,
  style,
  variant = "default",
  padding = "medium",
}: ChironCardProps) {
  const backgroundColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");
  const shadowColor = useThemeColor({}, "shadow");

  const getCardStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.card, { backgroundColor }];

    switch (variant) {
      case "elevated":
        baseStyle.push(styles.elevated);
        baseStyle.push({ shadowColor });
        break;
      case "outlined":
        baseStyle.push(styles.outlined);
        baseStyle.push({ borderColor });
        break;
    }

    switch (padding) {
      case "none":
        baseStyle.push(styles.noPadding);
        break;
      case "small":
        baseStyle.push(styles.smallPadding);
        break;
      case "medium":
        baseStyle.push(styles.mediumPadding);
        break;
      case "large":
        baseStyle.push(styles.largePadding);
        break;
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  elevated: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
  },
  noPadding: {
    padding: 0,
  },
  smallPadding: {
    padding: 12,
  },
  mediumPadding: {
    padding: 16,
  },
  largePadding: {
    padding: 20,
  },
});
