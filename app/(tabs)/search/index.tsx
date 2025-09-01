import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const searchCategories = [
  {
    name: "Doctors",
    icon: "person-outline",
    description: "Find healthcare professionals",
    route: "/(tabs)/doctors",
  },
  {
    name: "Pharmacies",
    icon: "storefront-outline",
    description: "Locate nearby pharmacies",
    route: "/(tabs)/pharmacy",
  },
  {
    name: "Drugs",
    icon: "medical-outline",
    description: "Search for medications",
    route: "/(tabs)/pharmacy/all-drugs",
  },
  {
    name: "Appointments",
    icon: "calendar-outline",
    description: "Manage your appointments",
    route: "/(tabs)/appointments",
  },
];

const recentSearches = [
  "Paracetamol",
  "Dr. John Smith",
  "Pharmacy near me",
  "Cardiology",
  "Blood pressure medication",
];

const popularSearches = [
  "COVID-19 vaccine",
  "Dentist",
  "Emergency clinic",
  "Insulin",
  "Pediatrician",
  "Eye doctor",
  "Blood test",
  "Pharmacy 24/7",
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");
  const borderColor = useThemeColor({}, "border");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  const handleCategoryPress = (category: any) => {
    router.push(category.route);
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const clearRecentSearch = (index: number) => {
    // TODO: Implement clear recent search functionality
    console.log("Clear recent search at index:", index);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Search</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: surfaceColor, borderColor },
            ]}
          >
            <Feather
              name="search"
              size={20}
              color={textSecondaryColor}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search for doctors, pharmacy, medicines..."
              placeholderTextColor={textSecondaryColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={textSecondaryColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Search Categories
          </Text>
          <View style={styles.categoriesGrid}>
            {searchCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryCard,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    { backgroundColor: `${primaryColor}20` },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={primaryColor}
                  />
                </View>
                <Text style={[styles.categoryName, { color: textColor }]}>
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryDescription,
                    { color: textSecondaryColor },
                  ]}
                  numberOfLines={2}
                >
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Recent Searches
              </Text>
              <TouchableOpacity>
                <Text style={[styles.clearAllText, { color: primaryColor }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchesList}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.searchItem,
                    { backgroundColor: surfaceColor, borderColor },
                  ]}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={textSecondaryColor}
                  />
                  <Text
                    style={[styles.searchItemText, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {search}
                  </Text>
                  <TouchableOpacity
                    onPress={() => clearRecentSearch(index)}
                    style={styles.clearButton}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={textSecondaryColor}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Popular Searches */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Popular Searches
          </Text>
          <View style={styles.popularSearches}>
            {popularSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.popularSearchChip,
                  { backgroundColor: surfaceColor, borderColor },
                ]}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Ionicons
                  name="trending-up"
                  size={14}
                  color={primaryColor}
                  style={styles.trendingIcon}
                />
                <Text style={[styles.popularSearchText, { color: textColor }]}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Tips */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Search Tips
          </Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons
                name="bulb-outline"
                size={16}
                color={primaryColor}
                style={styles.tipIcon}
              />
              <Text style={[styles.tipText, { color: textSecondaryColor }]}>
                Use specific terms like "pediatrician near me" for better
                results
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="bulb-outline"
                size={16}
                color={primaryColor}
                style={styles.tipIcon}
              />
              <Text style={[styles.tipText, { color: textSecondaryColor }]}>
                Search by drug name, brand, or generic name
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons
                name="bulb-outline"
                size={16}
                color={primaryColor}
                style={styles.tipIcon}
              />
              <Text style={[styles.tipText, { color: textSecondaryColor }]}>
                Filter results by location, availability, or rating
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    minHeight: 120,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  searchesList: {
    gap: 8,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  popularSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  popularSearchChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  trendingIcon: {
    marginRight: 4,
  },
  popularSearchText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
