import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface LogoWordProps {
  showText?: boolean;
  size?: "small" | "medium" | "large";
  style?: any;
}

export default function WordLogo({
  showText = true,
  size = "medium",
  style,
}: LogoWordProps) {

  const logoSizes = {
    small: { width: 120, height: 40 },
    medium: { width: 180, height: 60 },
    large: { width: 240, height: 80 },
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("@/assets/images/word_logo.png")}
        style={[logoSizes[size]]}
        height={200}
        width={200}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
