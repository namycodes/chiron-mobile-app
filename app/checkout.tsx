import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartStore } from "@/store/CartStore";
import { CartItem, DeliveryAddress, PaymentMethod, PaymentType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { cart, clearCart, getCartTotal } = CartStore();

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    isDefault: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: PaymentType.MOBILE_MONEY,
    details: {},
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = 15;
  const grandTotal = getCartTotal() + deliveryFee;

  const formatPrice = (price: number) => {
    return `ZMW${price.toFixed(2)}`;
  };

  const validateForm = () => {
    if (!deliveryAddress.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!deliveryAddress.phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    if (!deliveryAddress.address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return false;
    }
    if (!deliveryAddress.city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart after successful order
      clearCart();

      Alert.alert(
        "Order Placed Successfully!",
        "Your order has been placed and will be processed soon. You will receive a confirmation email shortly.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOrderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemName} numberOfLines={2}>
          {item.drug.name}
        </ThemedText>
        <Text style={[styles.itemDetails, { color: colors.tabIconDefault }]}>
          Qty: {item.quantity} × {formatPrice(item.drug.price)}
        </Text>
        {item.drug.requiresPrescription && (
          <View style={styles.prescriptionBadge}>
            <Ionicons name="medical" size={12} color="white" />
            <Text style={styles.prescriptionBadgeText}>Prescription</Text>
          </View>
        )}
      </View>
      <ThemedText style={styles.itemTotal}>
        {formatPrice(item.drug.price * item.quantity)}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          Checkout
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View
            style={[styles.section, { backgroundColor: colors.background }]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Order Summary ({cart.items.length} items)
            </ThemedText>
            <FlatList
              data={cart.items}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Delivery Address */}
          <View
            style={[styles.section, { backgroundColor: colors.background }]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Delivery Address
            </ThemedText>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Full Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.tabIconDefault}
                value={deliveryAddress.fullName}
                onChangeText={(text) =>
                  setDeliveryAddress((prev) => ({ ...prev, fullName: text }))
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Phone Number *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.tabIconDefault}
                value={deliveryAddress.phoneNumber}
                onChangeText={(text) =>
                  setDeliveryAddress((prev) => ({ ...prev, phoneNumber: text }))
                }
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Address *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                placeholder="Enter your full address"
                placeholderTextColor={colors.tabIconDefault}
                value={deliveryAddress.address}
                onChangeText={(text) =>
                  setDeliveryAddress((prev) => ({ ...prev, address: text }))
                }
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={[styles.label, { color: colors.text }]}>
                  City *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.tabIconDefault },
                  ]}
                  placeholder="City"
                  placeholderTextColor={colors.tabIconDefault}
                  value={deliveryAddress.city}
                  onChangeText={(text) =>
                    setDeliveryAddress((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Province
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.tabIconDefault },
                  ]}
                  placeholder="Province"
                  placeholderTextColor={colors.tabIconDefault}
                  value={deliveryAddress.province}
                  onChangeText={(text) =>
                    setDeliveryAddress((prev) => ({ ...prev, province: text }))
                  }
                />
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View
            style={[styles.section, { backgroundColor: colors.background }]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Payment Method
            </ThemedText>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                {
                  borderColor:
                    paymentMethod.type === PaymentType.MOBILE_MONEY
                      ? colors.tint
                      : colors.tabIconDefault,
                },
              ]}
              onPress={() =>
                setPaymentMethod({
                  type: PaymentType.MOBILE_MONEY,
                  details: {},
                })
              }
            >
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color={colors.tint}
              />
              <View style={styles.paymentContent}>
                <ThemedText style={styles.paymentTitle}>
                  Mobile Money
                </ThemedText>
                <Text
                  style={[
                    styles.paymentDescription,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  MTN, Airtel, Zamtel
                </Text>
              </View>
              <Ionicons
                name={
                  paymentMethod.type === PaymentType.MOBILE_MONEY
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  paymentMethod.type === PaymentType.MOBILE_MONEY
                    ? colors.tint
                    : colors.tabIconDefault
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                {
                  borderColor:
                    paymentMethod.type === PaymentType.CASH_ON_DELIVERY
                      ? colors.tint
                      : colors.tabIconDefault,
                },
              ]}
              onPress={() =>
                setPaymentMethod({
                  type: PaymentType.CASH_ON_DELIVERY,
                  details: {},
                })
              }
            >
              <Ionicons name="cash-outline" size={24} color={colors.tint} />
              <View style={styles.paymentContent}>
                <ThemedText style={styles.paymentTitle}>
                  Cash on Delivery
                </ThemedText>
                <Text
                  style={[
                    styles.paymentDescription,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Pay when you receive your order
                </Text>
              </View>
              <Ionicons
                name={
                  paymentMethod.type === PaymentType.CASH_ON_DELIVERY
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  paymentMethod.type === PaymentType.CASH_ON_DELIVERY
                    ? colors.tint
                    : colors.tabIconDefault
                }
              />
            </TouchableOpacity>
          </View>

          {/* Order Total */}
          <View
            style={[styles.section, { backgroundColor: colors.background }]}
          >
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Order Total
            </ThemedText>

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Subtotal
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatPrice(getCartTotal())}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Delivery Fee
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatPrice(deliveryFee)}
              </Text>
            </View>

            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <ThemedText type="subtitle" style={styles.grandTotalLabel}>
                Total
              </ThemedText>
              <ThemedText
                type="subtitle"
                style={[styles.grandTotalValue, { color: colors.tint }]}
              >
                {formatPrice(grandTotal)}
              </ThemedText>
            </View>
          </View>
        </ScrollView>

        {/* Place Order Button */}
        <View
          style={[styles.bottomSection, { backgroundColor: colors.background }]}
        >
          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              {
                backgroundColor: isProcessing
                  ? colors.tabIconDefault
                  : colors.tint,
              },
            ]}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            <Text style={styles.placeOrderButtonText}>
              {isProcessing
                ? "Processing..."
                : `Place Order • ${formatPrice(grandTotal)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  prescriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  prescriptionBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  paymentContent: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
