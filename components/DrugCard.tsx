import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartStore } from "@/store/CartStore";
import { WishlistStore } from "@/store/WishlistStore";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrescriptionModal } from "./PrescriptionModal";
import { ThemedText } from "./ThemedText";

interface DrugCardProps {
  drug: Drug;
  onPress: () => void;
}

export const DrugCard: React.FC<DrugCardProps> = ({ drug, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { addToCart } = CartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = WishlistStore();

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const isWishlisted = isInWishlist(drug.id);

  const formatPrice = (price: number) => {
    return `ZMW${(price || 0).toFixed(2)}`;
  };

  const getStockStatus = (quantity: number = 0) => {
    if (quantity === 0) return { text: "Out of Stock", color: "#EF4444" };
    if (quantity <= 10) return { text: "Low Stock", color: "#F59E0B" };
    return { text: "In Stock", color: "#10B981" };
  };

  const stockStatus = getStockStatus(drug.quantityAvailable);

  const handleAddToCart = () => {
    if (drug.requiresPrescription) {
      setShowPrescriptionModal(true);
    } else {
      addToCart(drug);
    }
  };

  const handlePrescriptionSubmit = (
    prescriptionCode?: string,
    prescriptionDocument?: string
  ) => {
    addToCart(drug, 1, prescriptionCode, prescriptionDocument);
    setShowPrescriptionModal(false);
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(drug.id);
    } else {
      addToWishlist(drug);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Image
          source={{
            uri: drug.imageUrl || "https://via.placeholder.com/80x80",
          }}
          style={styles.drugImage}
        />

        <View style={styles.drugInfo}>
          <View style={styles.header}>
            <ThemedText
              type="subtitle"
              style={styles.drugName}
              numberOfLines={2}
            >
              {drug.name || "Unknown Drug"}
            </ThemedText>
            {drug.requiresPrescription && (
              <View style={styles.prescriptionBadge}>
                <Ionicons name="medical" size={12} color="white" />
                <Text style={styles.prescriptionText}>Rx</Text>
              </View>
            )}
          </View>

          <Text style={[styles.manufacturer, { color: colors.tabIconDefault }]}>
            {drug.manufacturer || "Unknown manufacturer"}
          </Text>

          <Text
            style={[styles.dosage, { color: colors.text }]}
            numberOfLines={1}
          >
            {drug.dosage || "Dosage not specified"}
          </Text>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <ThemedText type="subtitle" style={styles.price}>
                {formatPrice(drug.price)}
              </ThemedText>
              <Text style={[styles.category, { color: colors.tabIconDefault }]}>
                {drug.category || "Uncategorized"}
              </Text>
            </View>

            <View style={styles.stockContainer}>
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: stockStatus.color },
                ]}
              />
              <Text style={[styles.stockText, { color: stockStatus.color }]}>
                {stockStatus.text}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.addToCartButton,
              {
                backgroundColor:
                  stockStatus.text === "Out of Stock"
                    ? colors.tabIconDefault
                    : colors.tint,
                opacity: stockStatus.text === "Out of Stock" ? 0.5 : 1,
              },
            ]}
            onPress={handleAddToCart}
            disabled={stockStatus.text === "Out of Stock"}
          >
 
            <Ionicons name="cart" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.wishlistButton,
              {
                backgroundColor: isWishlisted
                  ? "#EF4444"
                  : colors.tabIconDefault,
              },
            ]}
            onPress={handleToggleWishlist}
          >
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={16}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.viewButton,
              { backgroundColor: colors.tabIconDefault },
            ]}
            onPress={onPress}
          >
            <Ionicons name="eye" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <PrescriptionModal
        drug={drug}
        visible={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onSubmit={handlePrescriptionSubmit}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    padding: 16,
  },
  drugImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  drugInfo: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  drugName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  prescriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescriptionText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  manufacturer: {
    fontSize: 12,
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButton: {
    marginBottom: 8,
  },
  wishlistButton: {
    marginBottom: 8,
  },
  viewButton: {
    // No additional styles needed
  },
});
