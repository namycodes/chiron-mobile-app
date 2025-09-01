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
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DrugsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const colors = Colors[colorScheme ?? "light"];
  const { storeId, storeName } = useLocalSearchParams<{
    storeId: string;
    storeName: string;
  }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDrugModal, setShowDrugModal] = useState(false);

  const { drugs, loadingDrugs, errorDrugs, getDrugsByStoreId } = HealthStore();

  useEffect(() => {
    if (storeId) {
      getDrugsByStoreId(storeId);
    }
  }, [storeId, getDrugsByStoreId]);

  useEffect(() => {
    filterDrugs();
  }, [searchQuery, drugs]);

  const filterDrugs = () => {
    let filtered = drugs;

    if (searchQuery) {
      filtered = filtered.filter(
        (drug) =>
          drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drug.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drug.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDrugs(filtered);
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="medical-outline"
        size={80}
        color={colors.tabIconDefault}
      />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No Drugs Found
      </ThemedText>
      <ThemedText type="secondary" style={styles.emptySubtitle}>
        Try adjusting your search or check back later
      </ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="alert-circle-outline"
        size={80}
        color={colors.tabIconDefault}
      />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        Something went wrong
      </ThemedText>
      <ThemedText type="secondary" style={styles.emptySubtitle}>
        {errorDrugs}
      </ThemedText>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.tint }]}
        onPress={() => storeId && getDrugsByStoreId(storeId)}
      >
        <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={colors.tint} />
      <ThemedText type="secondary" style={styles.loadingText}>
        Loading drugs...
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>
              Available Drugs
            </ThemedText>
            <ThemedText type="secondary" style={styles.subtitle}>
              {storeName || "Pharmacy"}
            </ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.tabIconDefault}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search drugs by name, category, or manufacturer..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.tabIconDefault}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Results Count */}
        {!loadingDrugs && !errorDrugs && (
          <View style={styles.resultsHeader}>
            <ThemedText type="secondary">
              {filteredDrugs.length} drug{filteredDrugs.length !== 1 ? "s" : ""}{" "}
              found
            </ThemedText>
          </View>
        )}

        {/* Drugs List */}
        {loadingDrugs ? (
          renderLoadingState()
        ) : errorDrugs ? (
          renderErrorState()
        ) : (
          <FlatList
            data={filteredDrugs}
            renderItem={({ item }) => (
              <DrugCard drug={item} onPress={() => handleDrugPress(item)} />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </ThemedView>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "System",
  },
  clearButton: {
    marginLeft: 8,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  loadingState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
});
