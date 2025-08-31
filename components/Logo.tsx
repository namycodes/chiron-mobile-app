import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  style?: any;
}

export default function Logo({ size = "medium", style }: LogoProps) {
  const logoSizes = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 80, height: 80 },
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={[styles.logo, logoSizes[size]]}
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
  logo: {
    // Additional styling if needed
  },
});
