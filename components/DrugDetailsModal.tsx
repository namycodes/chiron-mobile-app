import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartStore } from "@/store/CartStore";
import { WishlistStore } from "@/store/WishlistStore";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PrescriptionModal } from "./PrescriptionModal";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface DrugDetailsModalProps {
  drug: Drug | null;
  visible: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

const { height: screenHeight } = Dimensions.get("window");

export const DrugDetailsModal: React.FC<DrugDetailsModalProps> = ({
  drug,
  visible,
  onClose,
  onAddToCart,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { addToCart } = CartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = WishlistStore();
  const router = useRouter();

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  if (!drug) return null;

  const isWishlisted = isInWishlist(drug.id);

  const formatPrice = (price: number) => {
    return `ZMW${price.toFixed(2)}`;
  };

  const getStockStatus = (quantity: number = 0) => {
    if (quantity === 0) return { text: "Out of Stock", color: "#EF4444" };
    if (quantity <= 10) return { text: "Low Stock", color: "#F59E0B" };
    return { text: "In Stock", color: "#10B981" };
  };

  const stockStatus = getStockStatus(drug.quantityAvailable);

  const InfoRow = ({
    icon,
    label,
    value,
    valueColor,
  }: {
    icon: string;
    label: string;
    value: string;
    valueColor?: string;
  }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon as any} size={20} color={colors.tint} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.tabIconDefault }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: valueColor || colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  const ListSection = ({
    title,
    items,
    icon,
  }: {
    title: string;
    items: string[];
    icon: string;
  }) => (
    <View style={[styles.section, { backgroundColor: colors.background }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={20} color={colors.tint} />
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <View
            style={[styles.bullet, { backgroundColor: colors.tabIconDefault }]}
          />
          <Text style={[styles.listItemText, { color: colors.text }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );

  const handleAddToCart = () => {
    if (drug.requiresPrescription) {
      setShowPrescriptionModal(true);
    } else {
      addToCart(drug, 1);
      Alert.alert(
        "Added to Cart",
        `${drug.name} has been added to your cart.`,
        [
          { text: "Continue Shopping", style: "cancel" },
          {
            text: "View Cart",
            onPress: () => {
              onClose();
              router.push("/(tabs)/cart");
            },
          },
        ]
      );
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(drug.id);
      Alert.alert(
        "Removed from Wishlist",
        `${drug.name} has been removed from your wishlist.`
      );
    } else {
      addToWishlist(drug);
      Alert.alert(
        "Added to Wishlist",
        `${drug.name} has been added to your wishlist.`
      );
    }
  };

  const handlePrescriptionSubmit = (
    prescriptionCode?: string,
    prescriptionDocument?: string
  ) => {
    addToCart(drug, 1, prescriptionCode, prescriptionDocument);
    setShowPrescriptionModal(false);

    Alert.alert(
      "Added to Cart",
      `${drug.name} has been added to your cart with prescription details.`,
      [
        { text: "Continue Shopping", style: "cancel" },
        {
          text: "View Cart",
          onPress: () => {
            onClose();
            router.push("/(tabs)/cart");
          },
        },
      ]
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <ThemedView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              Drug Details
            </ThemedText>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.content}
          >
            {/* Drug Image and Basic Info */}
            <View
              style={[
                styles.heroSection,
                { backgroundColor: colors.background },
              ]}
            >
              <Image
                source={{
                  uri: drug.imageUrl || "https://via.placeholder.com/150x150",
                }}
                style={styles.drugImage}
              />

              <View style={styles.basicInfo}>
                <View style={styles.nameContainer}>
                  <ThemedText type="title" style={styles.drugName}>
                    {drug.name}
                  </ThemedText>
                  {drug.requiresPrescription && (
                    <View style={styles.prescriptionBadge}>
                      <Ionicons name="medical" size={16} color="white" />
                      <Text style={styles.prescriptionText}>
                        Prescription Required
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.manufacturer,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  by {drug.manufacturer || "Unknown manufacturer"}
                </Text>

                <Text style={[styles.description, { color: colors.text }]}>
                  {drug.description ||
                    "No description available for this medication."}
                </Text>
              </View>
            </View>

            {/* Price and Stock */}
            <View
              style={[styles.section, { backgroundColor: colors.background }]}
            >
              <View style={styles.priceStockRow}>
                <View style={styles.priceContainer}>
                  <ThemedText type="title" style={styles.price}>
                    {formatPrice(drug.price || 0)}
                  </ThemedText>
                  <Text
                    style={[
                      styles.priceLabel,
                      { color: colors.tabIconDefault },
                    ]}
                  >
                    per unit
                  </Text>
                </View>

                <View style={styles.stockContainer}>
                  <View
                    style={[
                      styles.stockDot,
                      { backgroundColor: stockStatus.color },
                    ]}
                  />
                  <Text
                    style={[styles.stockText, { color: stockStatus.color }]}
                  >
                    {stockStatus.text}
                  </Text>
                  <Text
                    style={[
                      styles.stockQuantity,
                      { color: colors.tabIconDefault },
                    ]}
                  >
                    {drug.quantityAvailable || 0} available
                  </Text>
                </View>
              </View>
            </View>

            {/* Drug Information */}
            <View
              style={[styles.section, { backgroundColor: colors.background }]}
            >
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Drug Information
              </ThemedText>

              <InfoRow
                icon="medical-outline"
                label="Dosage"
                value={drug.dosage || "Not specified"}
              />

              <InfoRow
                icon="library-outline"
                label="Category"
                value={drug.category || "Uncategorized"}
              />

              <InfoRow
                icon="calendar-outline"
                label="Expiry Date"
                value={
                  drug.expiryDate
                    ? new Date(drug.expiryDate).toLocaleDateString()
                    : "Not specified"
                }
              />

              <InfoRow
                icon="barcode-outline"
                label="Batch Number"
                value={drug.batchNumber || "Not available"}
              />
            </View>

            {/* Active Ingredients */}
            {drug.activeIngredients && drug.activeIngredients.length > 0 ? (
              <ListSection
                title="Active Ingredients"
                items={drug.activeIngredients}
                icon="flask-outline"
              />
            ) : (
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Active Ingredients
                </ThemedText>
                <Text
                  style={[styles.noDataText, { color: colors.tabIconDefault }]}
                >
                  No active ingredients information available
                </Text>
              </View>
            )}

            {/* Side Effects */}
            {drug.sideEffects && drug.sideEffects.length > 0 ? (
              <ListSection
                title="Possible Side Effects"
                items={drug.sideEffects}
                icon="warning-outline"
              />
            ) : (
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Possible Side Effects
                </ThemedText>
                <Text
                  style={[styles.noDataText, { color: colors.tabIconDefault }]}
                >
                  No side effects information available
                </Text>
              </View>
            )}

            {/* Contraindications */}
            {drug.contraindications && drug.contraindications.length > 0 ? (
              <ListSection
                title="Contraindications"
                items={drug.contraindications}
                icon="close-circle-outline"
              />
            ) : (
              <View
                style={[styles.section, { backgroundColor: colors.background }]}
              >
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Contraindications
                </ThemedText>
                <Text
                  style={[styles.noDataText, { color: colors.tabIconDefault }]}
                >
                  No contraindications information available
                </Text>
              </View>
            )}

            {/* Safety Warning */}
            {drug.requiresPrescription && (
              <View
                style={[styles.warningSection, { backgroundColor: "#FEF2F2" }]}
              >
                <Ionicons name="warning" size={24} color="#EF4444" />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Prescription Required</Text>
                  <Text style={styles.warningText}>
                    This medication requires a valid prescription from a
                    licensed healthcare provider. Please consult with your
                    doctor before use.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          {drug.isAvailable !== false && (drug.quantityAvailable || 0) > 0 && (
            <View
              style={[
                styles.actionButtons,
                { backgroundColor: colors.background },
              ]}
            >
              <TouchableOpacity
                style={[
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
                  size={20}
                  color="white"
                />
                <Text style={styles.wishlistButtonText}>
                  {isWishlisted ? "Remove" : "Wishlist"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={handleAddToCart}
              >
                <Ionicons name="bag-add" size={20} color="white" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </Modal>

      {/* Prescription Modal */}
      <PrescriptionModal
        drug={drug}
        visible={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        onSubmit={handlePrescriptionSubmit}
      />
    </>
  );
};

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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  drugImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginBottom: 20,
  },
  basicInfo: {
    alignItems: "center",
    width: "100%",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  drugName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  prescriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prescriptionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  manufacturer: {
    fontSize: 16,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceStockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#059669",
  },
  priceLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  stockContainer: {
    alignItems: "flex-end",
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  stockQuantity: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  warningSection: {
    flexDirection: "row",
    padding: 16,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  wishlistButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  wishlistButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
