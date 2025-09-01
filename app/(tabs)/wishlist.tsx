import { DrugDetailsModal } from "@/components/DrugDetailsModal";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartStore } from "@/store/CartStore";
import { WishlistStore } from "@/store/WishlistStore";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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

export default function WishList() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { wishlist, removeFromWishlist, clearWishlist, getWishlistItemCount } =
    WishlistStore();
  const { addToCart } = CartStore();

  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const formatPrice = (price: number) => {
    return `ZMW${(price || 0).toFixed(2)}`;
  };

  const getStockStatus = (quantity: number = 0) => {
    if (quantity === 0) return { text: "Out of Stock", color: "#EF4444" };
    if (quantity <= 10) return { text: "Low Stock", color: "#F59E0B" };
    return { text: "In Stock", color: "#10B981" };
  };

  const handleRemoveFromWishlist = (drugId: string, drugName: string) => {
    Alert.alert(
      "Remove from Wishlist",
      `Are you sure you want to remove "${drugName}" from your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromWishlist(drugId),
        },
      ]
    );
  };

  const handleClearWishlist = () => {
    if (wishlist.items.length === 0) return;

    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to remove all items from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearWishlist(),
        },
      ]
    );
  };

  const handleAddToCart = (drug: Drug) => {
    addToCart(drug);
    Alert.alert("Added to Cart", `${drug.name} has been added to your cart.`);
  };

  const handleViewDetails = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowDetailsModal(true);
  };

  const renderWishlistItem = ({ item }: { item: any }) => {
    const stockStatus = getStockStatus(item.drug.quantityAvailable);

    return (
      <View
        style={[styles.itemContainer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => handleViewDetails(item.drug)}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: item.drug.imageUrl || "https://via.placeholder.com/80x80",
            }}
            style={styles.drugImage}
          />

          <View style={styles.drugInfo}>
            <View style={styles.itemHeader}>
              <ThemedText
                type="subtitle"
                style={styles.drugName}
                numberOfLines={2}
              >
                {item.drug.name || "Unknown Drug"}
              </ThemedText>
              {item.drug.requiresPrescription && (
                <View style={styles.prescriptionBadge}>
                  <Ionicons name="medical" size={12} color="white" />
                  <Text style={styles.prescriptionText}>Rx</Text>
                </View>
              )}
            </View>

            <Text
              style={[styles.manufacturer, { color: colors.tabIconDefault }]}
            >
              {item.drug.manufacturer || "Unknown manufacturer"}
            </Text>

            <Text
              style={[styles.dosage, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.drug.dosage || "Dosage not specified"}
            </Text>

            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                <ThemedText type="subtitle" style={styles.price}>
                  {formatPrice(item.drug.price)}
                </ThemedText>
                <Text
                  style={[styles.category, { color: colors.tabIconDefault }]}
                >
                  {item.drug.category || "Uncategorized"}
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
        </TouchableOpacity>

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
            onPress={() => handleAddToCart(item.drug)}
            disabled={stockStatus.text === "Out of Stock"}
          >
            <Ionicons name="cart" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.removeButton,
              { backgroundColor: "#EF4444" },
            ]}
            onPress={() =>
              handleRemoveFromWishlist(item.drug.id, item.drug.name)
            }
          >
            <Ionicons name="heart-dislike" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.tabIconDefault} />
      <ThemedText type="title" style={styles.emptyTitle}>
        Your Wishlist is Empty
      </ThemedText>
      <ThemedText type="secondary" style={styles.emptyText}>
        Add items to your wishlist to save them for later
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          My Wishlist
        </ThemedText>
        {wishlist.items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearWishlist}
            style={styles.clearButton}
          >
            <ThemedText type="link" style={styles.clearButtonText}>
              Clear All
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Wishlist Count */}
      {wishlist.items.length > 0 && (
        <View style={styles.countContainer}>
          <ThemedText style={styles.countText}>
            {getWishlistItemCount()}{" "}
            {getWishlistItemCount() === 1 ? "item" : "items"} in your wishlist
          </ThemedText>
        </View>
      )}

      {/* Wishlist Items */}
      <FlatList
        data={wishlist.items}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Drug Details Modal */}
      <DrugDetailsModal
        drug={selectedDrug}
        visible={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedDrug(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  countText: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  itemContainer: {
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
  itemContent: {
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
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  addToCartButton: {
    // backgroundColor handled dynamically
  },
  removeButton: {
    // backgroundColor: "#EF4444"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
  },
});
