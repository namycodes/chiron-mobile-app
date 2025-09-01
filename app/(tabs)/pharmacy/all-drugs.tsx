import { DrugCard } from "@/components/DrugCard";
import { DrugDetailsModal } from "@/components/DrugDetailsModal";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HealthStore } from "@/store/HealthStore";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AllDrugsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { allDrugs, loadingAllDrugs, errorAllDrugs, getAllDrugs } =
    HealthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showDrugModal, setShowDrugModal] = useState(false);

  useEffect(() => {
    if (allDrugs.length === 0) {
      getAllDrugs();
    }
  }, []);

  useEffect(() => {
    // Filter drugs based on search query
    if (searchQuery.trim() === "") {
      setFilteredDrugs(allDrugs);
    } else {
      const filtered = allDrugs.filter(
        (drug) =>
          drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drug.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          drug.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDrugs(filtered);
    }
  }, [allDrugs, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getAllDrugs();
    setRefreshing(false);
  };

  const handleDrugPress = (drug: Drug) => {
    setSelectedDrug(drug);
    setShowDrugModal(true);
  };

  const renderDrugItem = ({ item }: { item: Drug }) => (
    <DrugCard drug={item} onPress={() => handleDrugPress(item)} />
  );

  const renderEmptyState = () => {
    if (loadingAllDrugs && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Loading drugs...
          </Text>
        </View>
      );
    }

    if (errorAllDrugs) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.text} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Something went wrong
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text }]}>
            {errorAllDrugs}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={() => getAllDrugs()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredDrugs.length === 0 && searchQuery.trim() !== "") {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color={colors.text} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No drugs found
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text }]}>
            Try adjusting your search terms
          </Text>
        </View>
      );
    }

    if (allDrugs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="medical-outline" size={64} color={colors.text} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No drugs available
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text }]}>
            Check back later for available medications
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.text + "20" }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.text + "10" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          All Drugs
        </Text>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.text + "10" }]}
          onPress={() => {
            // TODO: Implement filter functionality
            console.log("Filter pressed");
          }}
        >
          <Ionicons name="filter" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchContainer, { borderColor: colors.text + "20" }]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.text}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search drugs..."
          placeholderTextColor={colors.text + "60"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Results Count */}
      {filteredDrugs.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {filteredDrugs.length} drug{filteredDrugs.length !== 1 ? "s" : ""}{" "}
            found
          </Text>
        </View>
      )}

      {/* Drugs List - Vertical Row Layout */}
      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => item.id}
        renderItem={renderDrugItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.tint]}
            tintColor={colors.tint}
          />
        }
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
      />

      {/* Drug Details Modal */}
      {selectedDrug && (
        <DrugDetailsModal
          drug={selectedDrug}
          visible={showDrugModal}
          onClose={() => {
            setShowDrugModal(false);
            setSelectedDrug(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
  },
  retryButton: {
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
