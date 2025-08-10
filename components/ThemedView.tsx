import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "secondary" | "surface" | "surfaceSecondary";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...otherProps
}: ThemedViewProps) {
  const getColorKey = (type: string) => {
    switch (type) {
      case "secondary":
        return "backgroundSecondary";
      case "surface":
        return "surface";
      case "surfaceSecondary":
        return "surfaceSecondary";
      default:
        return "background";
    }
  };

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey(type)
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
