import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartStore } from "@/store/CartStore";
import { CartItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = CartStore();

  const formatPrice = (price: number) => {
    return `ZMW${price.toFixed(2)}`;
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        "Remove Item",
        "Are you sure you want to remove this item from your cart?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => removeFromCart(itemId),
          },
        ]
      );
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items to your cart before proceeding to checkout."
      );
      return;
    }

    router.push("/checkout");
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: item.drug.imageUrl || "https://via.placeholder.com/80" }}
        style={styles.drugImage}
      />

      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <ThemedText type="subtitle" style={styles.drugName} numberOfLines={2}>
            {item.drug.name}
          </ThemedText>
          <TouchableOpacity
            onPress={() => removeFromCart(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.manufacturer, { color: colors.tabIconDefault }]}>
          {item.drug.manufacturer || "Unknown manufacturer"}
        </Text>

        {item.drug.requiresPrescription && (
          <View style={styles.prescriptionInfo}>
            <Ionicons name="medical" size={16} color="#EF4444" />
            <Text style={styles.prescriptionText}>
              {item.prescriptionCode
                ? `Prescription Code: ${item.prescriptionCode}`
                : "Prescription document uploaded"}
            </Text>
          </View>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { borderColor: colors.tabIconDefault },
              ]}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.quantity, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                { borderColor: colors.tabIconDefault },
              ]}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.unitPrice, { color: colors.tabIconDefault }]}>
              {formatPrice(item.drug.price)} each
            </Text>
            <ThemedText type="subtitle" style={styles.totalPrice}>
              {formatPrice(item.drug.price * item.quantity)}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Ionicons name="bag-outline" size={80} color={colors.tabIconDefault} />
      <ThemedText type="title" style={styles.emptyTitle}>
        Your cart is empty
      </ThemedText>
      <Text style={[styles.emptySubtitle, { color: colors.tabIconDefault }]}>
        Browse our pharmacy section to find the medications you need
      </Text>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: colors.tint }]}
        onPress={() => router.push("/(tabs)/pharmacy")}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartFooter = () => (
    <View style={[styles.cartFooter, { backgroundColor: colors.background }]}>
      <View style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel}>
          Items ({getCartItemCount()})
        </ThemedText>
        <ThemedText style={styles.summaryValue}>
          {formatPrice(getCartTotal())}
        </ThemedText>
      </View>

      <View style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel}>Delivery Fee</ThemedText>
        <ThemedText style={styles.summaryValue}>ZMW15.00</ThemedText>
      </View>

      <View style={[styles.summaryRow, styles.totalRow]}>
        <ThemedText type="subtitle" style={styles.totalLabel}>
          Total
        </ThemedText>
        <ThemedText
          type="subtitle"
          style={[styles.totalValue, { color: colors.tint }]}
        >
          {formatPrice(getCartTotal() + 15)}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          My Cart
        </ThemedText>
        {cart.items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            style={styles.clearButton}
          >
            <Text style={[styles.clearButtonText, { color: "#EF4444" }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cart.items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={renderCartFooter}
          />

          {/* Checkout Button */}
          <View
            style={[
              styles.checkoutContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout • {formatPrice(getCartTotal() + 15)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  drugImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  drugName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  manufacturer: {
    fontSize: 14,
    marginBottom: 8,
  },
  prescriptionInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FEF2F2",
    borderRadius: 6,
  },
  prescriptionText: {
    fontSize: 12,
    color: "#7F1D1D",
    marginLeft: 4,
    fontWeight: "500",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  unitPrice: {
    fontSize: 12,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  cartFooter: {
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  checkoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  shopButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
