import { Colors } from "@/constants/Colors";
import { WishlistStore } from "@/store/WishlistStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WishlistHeaderIconProps {
  color?: string;
  size?: number;
}

export const WishlistHeaderIcon: React.FC<WishlistHeaderIconProps> = ({
  color = Colors.light.primary,
  size = 22,
}) => {
  const { getWishlistItemCount } = WishlistStore();
  const itemCount = getWishlistItemCount();

  const handlePress = () => {
    router.push("/(tabs)/wishlist");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Feather name="heart" size={size} color={color} />
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {itemCount > 99 ? "99+" : itemCount.toString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});
