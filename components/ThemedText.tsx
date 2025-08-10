import { StyleSheet, Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "secondary"
    | "caption"
    | "error"
    | "success";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const getColorKey = () => {
    switch (type) {
      case "secondary":
        return "textSecondary";
      case "link":
        return "primary";
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "text";
    }
  };

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    getColorKey()
  );

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "secondary" ? styles.secondary : undefined,
        type === "caption" ? styles.caption : undefined,
        type === "error" ? styles.error : undefined,
        type === "success" ? styles.success : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  success: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
