import { DrugCard } from "@/components/DrugCard";
import { DrugDetailsModal } from "@/components/DrugDetailsModal";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HealthStore } from "@/store/HealthStore";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PharmacyDetailsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme ?? "light"];
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Store Id: ", id);

  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDrugModal, setShowDrugModal] = useState(false);

  const {
    drugStoreDetails,
    loadingDrugStoreDetails,
    errorDrugStoreDetails,
    getDrugStoreById,
    drugs,
    loadingDrugs,
    errorDrugs,
    getDrugsByStoreId,
  } = HealthStore();

  useEffect(() => {
    if (id) {
      getDrugStoreById(id);
      getDrugsByStoreId(id);
    }
  }, [id, getDrugStoreById, getDrugsByStoreId]);

  const handleCall = () => {
    if (drugStoreDetails?.phoneNumber) {
      Linking.openURL(`tel:${drugStoreDetails.phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (drugStoreDetails?.email) {
      Linking.openURL(`mailto:${drugStoreDetails.email}`);
    }
  };

  const handleGetDirections = () => {
    if (drugStoreDetails?.address) {
      const encodedAddress = encodeURIComponent(drugStoreDetails.address);
      const url = `https://maps.google.com/?q=${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  const handleDrugPress = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowDrugModal(true);
  };

  const handleCloseDrugModal = () => {
    setShowDrugModal(false);
    setSelectedDrug(null);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", selectedDrug?.name);
    handleCloseDrugModal();
  };

  const handleViewAllDrugs = () => {
    router.push({
      pathname: `/pharmacy/drugs`,
      params: {
        storeId: id,
        storeName: drugStoreDetails?.name || "Pharmacy",
      },
    });
  };

  // Limit drugs to show only 4 in the details page
  const displayedDrugs = drugs.slice(0, 4);
  const hasMoreDrugs = drugs.length > 4;

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.tint} />
      <ThemedText style={styles.loadingText}>
        Loading pharmacy details...
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={80}
        color={colors.tabIconDefault}
      />
      <ThemedText type="subtitle" style={styles.errorTitle}>
        Something went wrong
      </ThemedText>
      <ThemedText type="secondary" style={styles.errorSubtitle}>
        {errorDrugStoreDetails}
      </ThemedText>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.tint }]}
        onPress={() => id && getDrugStoreById(id)}
      >
        <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (loadingDrugStoreDetails) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (errorDrugStoreDetails) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  if (!drugStoreDetails) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Ionicons
            name="storefront-outline"
            size={80}
            color={colors.tabIconDefault}
          />
          <ThemedText type="subtitle" style={styles.errorTitle}>
            Pharmacy not found
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

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
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Pharmacy Details
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={displayedDrugs}
        renderItem={({ item }) => (
          <DrugCard drug={item} onPress={() => handleDrugPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <ThemedView style={styles.content}>
            {/* Pharmacy Profile */}
            <View
              style={[
                styles.profileSection,
                { backgroundColor: colors.background },
              ]}
            >
              <Image
                source={{
                  uri:
                    drugStoreDetails.profilePicture ||
                    "https://via.placeholder.com/100",
                }}
                style={styles.pharmacyImage}
              />
              <View style={styles.pharmacyInfo}>
                <View style={styles.nameContainer}>
                  <ThemedText type="title" style={styles.pharmacyName}>
                    {drugStoreDetails.name || "Unknown Pharmacy"}
                  </ThemedText>
                  {drugStoreDetails.isVerified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.tint}
                      style={styles.verifiedIcon}
                    />
                  )}
                </View>

                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={18} color="#FFD700" />
                  <Text style={[styles.rating, { color: colors.text }]}>
                    {drugStoreDetails.rating || 0}/5
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.tabIconDefault}
                  />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {drugStoreDetails.address || "Address not available"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View
              style={[styles.section, { backgroundColor: colors.background }]}
            >
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Contact Information
              </ThemedText>

              <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call-outline" size={20} color={colors.tint} />
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText style={styles.contactLabel}>Phone</ThemedText>
                  <Text style={[styles.contactValue, { color: colors.text }]}>
                    {drugStoreDetails.phoneNumber || "Not available"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.tabIconDefault}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleEmail}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name="mail-outline" size={20} color={colors.tint} />
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText style={styles.contactLabel}>Email</ThemedText>
                  <Text style={[styles.contactValue, { color: colors.text }]}>
                    {drugStoreDetails.email || "Not available"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.tabIconDefault}
                />
              </TouchableOpacity>

              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons
                    name="medical-outline"
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText style={styles.contactLabel}>
                    NHIMA Number
                  </ThemedText>
                  <Text style={[styles.contactValue, { color: colors.text }]}>
                    {drugStoreDetails.nhimaNumber || "Not available"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Location */}
            <View
              style={[styles.section, { backgroundColor: colors.background }]}
            >
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Location
              </ThemedText>

              <View style={styles.locationContainer}>
                <Ionicons name="location" size={20} color={colors.tint} />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {drugStoreDetails.address || "Address not available"}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.directionsButton,
                  { backgroundColor: colors.tint },
                ]}
                onPress={handleGetDirections}
              >
                <Ionicons name="navigate-outline" size={20} color="white" />
                <ThemedText style={styles.directionsButtonText}>
                  Get Directions
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={20} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  Call Now
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.background,
                    borderWidth: 1,
                    borderColor: colors.tint,
                  },
                ]}
                onPress={handleEmail}
              >
                <Ionicons name="mail" size={20} color={colors.tint} />
                <ThemedText
                  style={[styles.actionButtonText, { color: colors.tint }]}
                >
                  Send Email
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Drugs Section Header */}
            <View style={styles.drugsHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Available Drugs ({drugs.length})
              </ThemedText>
              {loadingDrugs && (
                <ActivityIndicator size="small" color={colors.tint} />
              )}
            </View>
          </ThemedView>
        )}
        ListFooterComponent={() =>
          hasMoreDrugs &&
          !loadingDrugs &&
          !errorDrugs &&
          displayedDrugs.length > 0 ? (
            <View style={styles.viewMoreContainer}>
              <TouchableOpacity
                style={[
                  styles.viewMoreButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.tint,
                  },
                ]}
                onPress={handleViewAllDrugs}
              >
                <ThemedText
                  style={[styles.viewMoreText, { color: colors.tint }]}
                >
                  View All {drugs.length} Drugs
                </ThemedText>
                <Ionicons name="arrow-forward" size={20} color={colors.tint} />
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          drugs.length === 0 ? (
            <View style={styles.emptyState}>
              {loadingDrugs ? (
                <>
                  <ActivityIndicator size="large" color={colors.tint} />
                  <ThemedText style={styles.emptyText}>
                    Loading drugs...
                  </ThemedText>
                </>
              ) : errorDrugs ? (
                <>
                  <Ionicons
                    name="alert-circle-outline"
                    size={60}
                    color={colors.tabIconDefault}
                  />
                  <ThemedText style={styles.emptyText}>{errorDrugs}</ThemedText>
                </>
              ) : (
                <>
                  <Ionicons
                    name="medical-outline"
                    size={60}
                    color={colors.tabIconDefault}
                  />
                  <ThemedText style={styles.emptyText}>
                    No drugs available
                  </ThemedText>
                </>
              )}
            </View>
          ) : null
        }
      />

      {/* Drug Details Modal */}
      <DrugDetailsModal
        visible={showDrugModal}
        drug={selectedDrug}
        onClose={handleCloseDrugModal}
        onAddToCart={handleAddToCart}
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
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pharmacyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: "#E5E7EB",
  },
  pharmacyInfo: {
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  drugsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  viewMoreContainer: {
    padding: 20,
    paddingTop: 10,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
