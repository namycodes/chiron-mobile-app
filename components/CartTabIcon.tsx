import { CartStore } from "@/store/CartStore";
import { SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CartTabIconProps {
  color: string;
  size?: number;
}

export const CartTabIcon: React.FC<CartTabIconProps> = ({
  color,
  size = 20,
}) => {
  const { getCartItemCount } = CartStore();
  const itemCount = getCartItemCount();

  return (
    <View style={styles.container}>
      <SimpleLineIcons name="handbag" size={size} color={color} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? "99+" : itemCount.toString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontWeight: "bold",
  },
});
