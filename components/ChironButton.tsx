import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChironButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ChironButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ChironButtonProps) {
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const borderColor = useThemeColor({}, "border");

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.button];

    switch (size) {
      case "small":
        baseStyle.push(styles.small);
        break;
      case "large":
        baseStyle.push(styles.large);
        break;
      default:
        baseStyle.push(styles.medium);
    }

    switch (variant) {
      case "primary":
        baseStyle.push({ backgroundColor: primaryColor });
        break;
      case "secondary":
        baseStyle.push({
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: primaryColor,
        });
        break;
      case "outline":
        baseStyle.push({
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: borderColor,
        });
        break;
      case "danger":
        baseStyle.push({ backgroundColor: errorColor });
        break;
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle: TextStyle[] = [styles.text];

    switch (size) {
      case "small":
        baseTextStyle.push(styles.smallText);
        break;
      case "large":
        baseTextStyle.push(styles.largeText);
        break;
      default:
        baseTextStyle.push(styles.mediumText);
    }

    switch (variant) {
      case "primary":
      case "danger":
        baseTextStyle.push({ color: "#FFFFFF" });
        break;
      case "secondary":
        baseTextStyle.push({ color: primaryColor });
        break;
      case "outline":
        baseTextStyle.push({ color: textColor });
        break;
    }

    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.6,
  },
});
