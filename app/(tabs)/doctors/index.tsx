import ChironBottomSheet, {
  ChironBottomSheetHandles,
} from "@/components/ChironBottomSheet";
import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { ChironChip } from "@/components/ChironChip";
import Divider from "@/components/Divider";
import { grayLightBorder } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HealthStore } from "@/store/HealthStore";
import { HealthPersonnel, HealthPersonnelViewModel } from "@/types";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const specialties = [
  "All",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist",
  "Orthopedic",
  "Neurologist",
];

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  type SelectedDoctorType = HealthPersonnel & Partial<HealthPersonnelViewModel>;
  const [selectedDoctor, setSelectedDoctor] =
    useState<SelectedDoctorType | null>(null);
  const [actionType, setActionType] = useState<"book" | "view">("book");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const { getHealthPersonnel, personnel, loadingPersonnel } = HealthStore();

  useEffect(() => {
    getHealthPersonnel();
  }, []);

  // Filter states
  const [priceRange, setPriceRange] = useState([50, 300]);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string>("All");
  // Filtered list derived from the fetched personnel
  const [filteredDoctors, setFilteredDoctors] = useState<HealthPersonnel[]>([]);

  const bottomSheetRef = useRef<ChironBottomSheetHandles>(null);
  const filterSheetRef = useRef<ChironBottomSheetHandles>(null);
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");

  // Whenever the source personnel changes, reset the filtered list
  useEffect(() => {
    setFilteredDoctors(personnel ?? []);
  }, [personnel]);

  // Re-apply filters when filter parameters change
  useEffect(() => {
    filterDoctors(searchQuery, selectedSpecialty);
  }, [priceRange, minExperience, selectedGender, selectedSpecialty]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterDoctors(query, selectedSpecialty);
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
    // Apply immediately with the chosen specialty
    filterDoctors(searchQuery, specialty);
  };

  const filterDoctors = (query: string, specialty: string) => {
    const list = personnel ?? [];
    const q = query?.trim().toLowerCase() ?? "";

    const results = list.filter((doctor) => {
      // Specialty filter
      if (specialty && specialty !== "All") {
        const docSpec = (doctor.specialty || "").toLowerCase();
        if (!docSpec.includes(specialty.toLowerCase())) return false;
      }

      // Price range filter
      const rate = Number((doctor as any).rate) || 0;
      if (rate < priceRange[0] || rate > priceRange[1]) return false;

      // Experience filter
      const exp = Number((doctor as any).experience) || 0;
      if (exp < minExperience) return false;

      // Gender filter
      if (selectedGender && selectedGender !== "All") {
        const g = (doctor as any).gender || "";
        if (g.toLowerCase() !== selectedGender.toLowerCase()) return false;
      }

      // Search query across multiple fields
      if (q.length > 0) {
        const haystack = [
          doctor.firstName,
          doctor.lastName,
          doctor.specialty,
          doctor.hospitalName,
          (doctor as any).nhimaNumber,
          (doctor as any).phoneNumber,
          (doctor as any).email,
          ((doctor as any).tags || []).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    setFilteredDoctors(results);
  };

  // Map rating to a small color indicator used in the list
  const getRatingColor = (rating: number | undefined) => {
    if (!rating && rating !== 0) return textSecondaryColor;
    if (rating >= 4) return "#4CAF50";
    if (rating >= 3) return "#FF9800";
    return "#F44336";
  };

  const handleDoctorAction = (
    doctor: SelectedDoctorType,
    action: "book" | "view"
  ) => {
    // doctor is expected to conform to HealthPersonnelViewModel from the store
    setSelectedDoctor(doctor);
    setActionType(action);
    setIsBottomSheetVisible(true);
    bottomSheetRef.current?.open(2);
  };

  const handleOpenFilter = () => {
    setIsFilterSheetVisible(true);
    filterSheetRef.current?.open(2);
  };

  const handleApplyFilters = () => {
    filterDoctors(searchQuery, selectedSpecialty);
    filterSheetRef.current?.close();
    setIsFilterSheetVisible(false);
  };

  const handleResetFilters = () => {
    setPriceRange([50, 300]);
    setMinExperience(0);
    setSelectedGender("All");
    filterDoctors(searchQuery, selectedSpecialty);
  };

  const renderDoctor = ({ item: doctor }: { item: HealthPersonnel }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/doctors/${doctor.id}`)}
      activeOpacity={0.9}
    >
      <ChironCard style={styles.doctorCard} variant="default">
        <View style={styles.doctorContent}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorImageContainer}>
              <Animated.Image
                source={{ uri: doctor.profilePicture }}
                style={styles.doctorImage}
                defaultSource={require("@/assets/images/icon.png")}
                sharedTransitionTag={`doctor-image-${doctor.id}`}
              />
              <View
                style={[
                  styles.availabilityDot,
                  {
                    backgroundColor: getRatingColor(doctor.rating as any),
                  },
                ]}
              />
            </View>
            <View style={styles.doctorInfo}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[styles.doctorName, { color: textColor }]}
                  numberOfLines={1}
                >
                  {doctor.firstName + " " + doctor.lastName}
                </Text>
                {doctor.isVerified ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <MaterialIcons
                      name="verified"
                      size={15}
                      color={primaryColor}
                    />
                  </View>
                ) : null}
              </View>

              <Text
                style={[styles.specialty, { color: primaryColor }]}
                numberOfLines={1}
              >
                {doctor.specialty}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.rating, { color: textColor }]}>
                  {doctor.rating}
                </Text>
                <Text
                  style={[styles.experience, { color: textSecondaryColor }]}
                  numberOfLines={1}
                >
                  <SimpleLineIcons name="handbag" /> {doctor.experience} years
                  exp
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.hospitalInfo}>
            <Ionicons
              name="business-outline"
              size={16}
              color={textSecondaryColor}
            />
            <Text
              style={[styles.hospital, { color: textSecondaryColor }]}
              numberOfLines={1}
            >
              {doctor.hospitalName}
            </Text>
          </View>

          <Divider />

          <View style={styles.bottomSection}>
            <View style={styles.feeContainer}>
              <Text style={[styles.feeLabel, { color: textSecondaryColor }]}>
                Consultation
              </Text>
              <Text style={[styles.fee, { color: textColor }]}>
                K{doctor.rate}
              </Text>
            </View>
            <ChironButton
              title={"View Profile"}
              onPress={() => handleDoctorAction(doctor, "view")}
              size="small"
              variant={"primary"}
              style={styles.bookButton}
            />
          </View>
        </View>
      </ChironCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Find Doctors
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleOpenFilter}
        >
          <Ionicons name="options-outline" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View>
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: surfaceColor, borderColor },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={textSecondaryColor}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Search doctors, specialties, hospitals..."
              placeholderTextColor={textSecondaryColor}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={textSecondaryColor}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialtiesContainer}
          contentContainerStyle={styles.specialtiesContent}
        >
          {specialties.map((specialty) => (
            <ChironChip
              key={specialty}
              label={specialty}
              onPress={() => handleSpecialtyFilter(specialty)}
              isSelected={selectedSpecialty === specialty}
              size="medium"
              style={styles.specialtyChip}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.resultsHeader}>
          {loadingPersonnel ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <ActivityIndicator size="small" color={primaryColor} />
              <Text style={[styles.resultsCount, { color: textColor }]}>
                Loading doctors...
              </Text>
            </View>
          ) : (
            <Text style={[styles.resultsCount, { color: textColor }]}>
              {filteredDoctors?.length ?? 0} doctors found
            </Text>
          )}
          <TouchableOpacity style={styles.sortButton}>
            <Text style={[styles.sortText, { color: primaryColor }]}>
              Sort by rating
            </Text>
            <Ionicons name="chevron-down" size={16} color={primaryColor} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredDoctors ?? []}
          ListEmptyComponent={() => (
            <View style={[styles.emptyContainer, { minHeight: 300 }]}>
              {loadingPersonnel ? (
                <ActivityIndicator size="large" color={primaryColor} />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.emptyTitle, { color: textColor }]}>
                    No doctors found
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtitle,
                      { color: textSecondaryColor },
                    ]}
                  >
                    Try adjusting filters or retry fetching the list.
                  </Text>
                  <ChironButton
                    title="Retry"
                    onPress={getHealthPersonnel}
                    style={styles.retryButton}
                  />
                </View>
              )}
            </View>
          )}
          renderItem={renderDoctor}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.doctorsList}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 180,
            offset: 180 * index + 16 * index,
            index,
          })}
        />
      </View>

      <ChironBottomSheet ref={bottomSheetRef}>
        {isBottomSheetVisible && selectedDoctor && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.doctorDetailHeader}>
                <Animated.Image
                  source={{ uri: selectedDoctor.profilePicture }}
                  style={styles.bottomSheetDoctorImage}
                  defaultSource={require("@/assets/images/icon.png")}
                  sharedTransitionTag={`doctor-image-${selectedDoctor.id}`}
                />
                <View style={styles.bottomSheetDoctorInfo}>
                  <View style={styles.doctorNameRow}>
                    <Text
                      style={[
                        styles.bottomSheetDoctorName,
                        { color: textColor },
                      ]}
                    >
                      {selectedDoctor.firstName + " " + selectedDoctor.lastName}
                    </Text>
                    {selectedDoctor.isVerified && (
                      <MaterialIcons
                        name="verified"
                        size={20}
                        color={primaryColor}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.bottomSheetSpecialty,
                      { color: primaryColor },
                    ]}
                  >
                    {selectedDoctor.specialty}
                  </Text>
                  <View style={styles.bottomSheetRating}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text
                      style={[
                        styles.bottomSheetRatingText,
                        { color: textColor, gap: 2 },
                      ]}
                    >
                      {selectedDoctor.rating} <SimpleLineIcons name="handbag" />{" "}
                      {selectedDoctor.experience} years experience
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Divider />

            <ScrollView
              style={styles.bottomSheetScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Hospital
                </Text>
                <View style={styles.hospitalRow}>
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={textSecondaryColor}
                  />
                  <Text
                    style={[styles.hospitalText, { color: textSecondaryColor }]}
                  >
                    {selectedDoctor.hospitalName}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Specializations
                </Text>
                <View style={styles.tagsRow}>
                  {selectedDoctor?.tags?.map((tag, index) => (
                    <ChironChip
                      key={index}
                      label={tag}
                      size="small"
                      style={styles.tagChip}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Contact
                </Text>
                <View style={{ marginBottom: 8 }}>
                  <Text
                    style={[styles.hospitalText, { color: textSecondaryColor }]}
                  >
                    NHIMA: {selectedDoctor?.nhimaNumber || "N/A"}
                  </Text>
                  <Text
                    style={[styles.hospitalText, { color: textSecondaryColor }]}
                  >
                    Phone: {selectedDoctor?.phoneNumber || "N/A"}
                  </Text>
                  <Text
                    style={[styles.hospitalText, { color: textSecondaryColor }]}
                  >
                    Email: {selectedDoctor?.email || "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Consultation Fee
                </Text>
                <Text style={[styles.feeText, { color: textColor }]}>
                  K{selectedDoctor.rate}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.bottomSheetActions}>
              <ChironButton
                title="Close"
                onPress={() => {
                  bottomSheetRef.current?.close();
                  setIsBottomSheetVisible(false);
                }}
                variant="outline"
                style={styles.closeButton}
              />
              <ChironButton
                title={
                  actionType === "book"
                    ? "Schedule Appointment"
                    : "View Full Profile"
                }
                onPress={() => {
                  bottomSheetRef.current?.close();
                  setIsBottomSheetVisible(false);

                  if (selectedDoctor) {
                    router.push(`/(tabs)/doctors/${selectedDoctor.id}`);
                  }
                }}
                variant="primary"
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </ChironBottomSheet>

      <ChironBottomSheet ref={filterSheetRef}>
        {isFilterSheetVisible && (
          <View style={styles.filterBottomSheetContent}>
            <View style={styles.filterHeader}>
              <Text style={[styles.filterTitle, { color: textColor }]}>
                Filter Doctors
              </Text>
              <TouchableOpacity
                onPress={() => {
                  filterSheetRef.current?.close();
                  setIsFilterSheetVisible(false);
                }}
              >
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.filterScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: textColor }]}>
                  Price Range (K{priceRange[0]} - K{priceRange[1]})
                </Text>
                <View style={styles.sliderContainer}>
                  <Text
                    style={[styles.sliderLabel, { color: textSecondaryColor }]}
                  >
                    Minimum: K{priceRange[0]}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={50}
                    maximumValue={300}
                    value={priceRange[0]}
                    onValueChange={(value: number) =>
                      setPriceRange([Math.round(value), priceRange[1]])
                    }
                    minimumTrackTintColor={primaryColor}
                    maximumTrackTintColor={borderColor}
                    thumbTintColor={primaryColor}
                  />
                </View>
                <View style={styles.sliderContainer}>
                  <Text
                    style={[styles.sliderLabel, { color: textSecondaryColor }]}
                  >
                    Maximum: K{priceRange[1]}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={50}
                    maximumValue={300}
                    value={priceRange[1]}
                    onValueChange={(value: number) =>
                      setPriceRange([priceRange[0], Math.round(value)])
                    }
                    minimumTrackTintColor={primaryColor}
                    maximumTrackTintColor={borderColor}
                    thumbTintColor={primaryColor}
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: textColor }]}>
                  Minimum Experience ({minExperience} years)
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={25}
                  value={minExperience}
                  onValueChange={(value: number) =>
                    setMinExperience(Math.round(value))
                  }
                  minimumTrackTintColor={primaryColor}
                  maximumTrackTintColor={borderColor}
                  thumbTintColor={primaryColor}
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { color: textColor }]}>
                  Gender
                </Text>
                <View style={styles.genderChips}>
                  {["All", "Male", "Female"].map((gender) => (
                    <ChironChip
                      key={gender}
                      label={gender}
                      onPress={() => setSelectedGender(gender)}
                      isSelected={selectedGender === gender}
                      size="medium"
                      style={styles.genderChip}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.filterActions}>
              <ChironButton
                title="Reset"
                onPress={handleResetFilters}
                variant="outline"
                style={styles.resetButton}
              />
              <ChironButton
                title="Apply Filters"
                onPress={handleApplyFilters}
                variant="primary"
                style={styles.applyButton}
              />
            </View>
          </View>
        )}
      </ChironBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 8,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  specialtiesContainer: {
    marginBottom: 8,
    height: undefined,
    paddingVertical: 4,
  },
  specialtiesContent: {
    paddingHorizontal: 16,
    paddingRight: 24,
    alignItems: "center",
  },
  specialtyChip: {
    marginRight: 8,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: "500",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  doctorsList: {
    paddingBottom: 80,
    flexGrow: 1,
    paddingTop: 0,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  doctorCard: {
    marginBottom: 16,
    minHeight: 150,
    borderColor: grayLightBorder,
    borderRadius: 12,
    borderWidth: 1,
  },
  doctorContent: {
    flex: 1,
    padding: 16,
  },
  doctorHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  doctorImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  doctorImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F0F0F0",
  },
  availabilityDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
  },
  experience: {
    fontSize: 12,
    marginLeft: 6,
  },
  hospitalInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  hospital: {
    fontSize: 13,
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  distance: {
    fontSize: 14,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  feeContainer: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  fee: {
    fontSize: 15,
    fontWeight: "700",
  },
  bookButton: {
    minWidth: 90,
  },
  // Bottom Sheet Styles
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bottomSheetHeader: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  doctorDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheetDoctorImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F0F0",
    marginRight: 12,
  },
  bottomSheetDoctorInfo: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  bottomSheetDoctorName: {
    fontSize: 18,
    fontWeight: "700",
  },
  bottomSheetSpecialty: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  bottomSheetRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bottomSheetRatingText: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 16,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  hospitalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hospitalText: {
    fontSize: 15,
    flex: 1,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagChip: {
    marginBottom: 2,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  availabilityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 15,
    flex: 1,
  },
  feeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bottomSheetActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
  },
  closeButton: {
    flex: 1,
  },
  actionButton: {
    flex: 2,
  },
  // Filter Bottom Sheet Styles
  filterBottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  filterScroll: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 12,
  },
  slider: {
    height: 36,
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  genderChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderChip: {
    minWidth: 64,
  },
  filterActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryButton: {
    minWidth: 140,
  },
});
