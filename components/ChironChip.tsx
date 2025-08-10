import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ChironChipProps {
  label: string;
  onPress?: () => void;
  isSelected?: boolean;
  variant?: "default" | "outline" | "filled";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ChironChip({
  label,
  onPress,
  isSelected = false,
  variant = "outline",
  size = "medium",
  disabled = false,
  style,
  textStyle,
}: ChironChipProps) {
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const textSecondaryColor = useThemeColor({}, "textSecondary");

  const getChipStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.chip];

    // Size variants
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

    // Color variants
    if (isSelected) {
      baseStyle.push({
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      });
    } else {
      switch (variant) {
        case "filled":
          baseStyle.push({
            backgroundColor: surfaceColor,
            borderColor: surfaceColor,
          });
          break;
        case "outline":
        default:
          baseStyle.push({
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          });
      }
    }

    // Disabled state
    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle: TextStyle[] = [styles.text];

    // Size-based text styles
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

    // Color-based text styles
    if (isSelected) {
      baseTextStyle.push({ color: "#FFFFFF" });
    } else {
      baseTextStyle.push({ color: textColor });
    }

    // Disabled text color
    if (disabled) {
      baseTextStyle.push({ color: textSecondaryColor });
    }

    return baseTextStyle;
  };

  const chipContent = (
    <Text style={[...getTextStyle(), textStyle]} numberOfLines={1}>
      {label}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[...getChipStyle(), style]}
        onPress={disabled ? undefined : onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {chipContent}
      </TouchableOpacity>
    );
  }

  return <View style={[...getChipStyle(), style]}>{chipContent}</View>;
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  // Size variants
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 24,
    borderRadius: 12,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    height: 32,
    borderRadius: 16,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 40,
    borderRadius: 20,
  },
  // Text styles
  text: {
    fontWeight: "500",
    textAlign: "center",
  },
  smallText: {
    fontSize: 11,
    lineHeight: 14,
  },
  mediumText: {
    fontSize: 13,
    lineHeight: 16,
  },
  largeText: {
    fontSize: 14,
    lineHeight: 18,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
});
