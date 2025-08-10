import ChironBottomSheet, {
  ChironBottomSheetHandles,
} from "@/components/ChironBottomSheet";
import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { ChironChip } from "@/components/ChironChip";
import Divider from "@/components/Divider";
import { grayLightBorder } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Doctor } from "@/types";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: 12,
    hospital: "City General Hospital",
    distance: "2.5 km",
    consultationFee: 150,
    availability: "available",
    image: "https://via.placeholder.com/300x400",
    tags: ["Heart Specialist", "Emergency Care"],
    isVerified: true,
    gender: "female",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    rating: 4.9,
    experience: 8,
    hospital: "Children's Medical Center",
    distance: "1.8 km",
    consultationFee: 120,
    availability: "available",
    image: "https://via.placeholder.com/300x400",
    tags: ["Child Care", "Vaccines"],
    isVerified: true,
    gender: "male",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.7,
    experience: 15,
    hospital: "Skin Care Clinic",
    distance: "3.2 km",
    consultationFee: 180,
    availability: "busy",
    image: "https://via.placeholder.com/300x400",
    tags: ["Skin Care", "Cosmetic"],
    isVerified: false,
    gender: "female",
  },
  {
    id: "4",
    name: "Dr. David Kumar",
    specialty: "Orthopedic",
    rating: 4.6,
    experience: 20,
    hospital: "Bone & Joint Center",
    distance: "4.1 km",
    consultationFee: 200,
    availability: "available",
    image: "https://via.placeholder.com/300x400",
    tags: ["Bone Care", "Sports Medicine"],
    isVerified: true,
    gender: "male",
  },
];

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
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [actionType, setActionType] = useState<"book" | "view">("book");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  // Filter states
  const [priceRange, setPriceRange] = useState([50, 300]);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string>("All");

  const bottomSheetRef = useRef<ChironBottomSheetHandles>(null);
  const filterSheetRef = useRef<ChironBottomSheetHandles>(null);
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");

  // Re-apply filters when filter parameters change
  useEffect(() => {
    filterDoctors(searchQuery, selectedSpecialty);
  }, [priceRange, minExperience, selectedGender]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterDoctors(query, selectedSpecialty);
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
    filterDoctors(searchQuery, specialty);
  };

  const filterDoctors = (query: string, specialty: string) => {
    let filtered = mockDoctors;

    // Filter by specialty
    if (specialty !== "All") {
      filtered = filtered.filter((doctor) => doctor.specialty === specialty);
    }

    // Filter by search query
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
          doctor.hospital.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply additional filters
    filtered = filtered.filter((doctor) => {
      // Price range filter
      const withinPriceRange =
        doctor.consultationFee >= priceRange[0] &&
        doctor.consultationFee <= priceRange[1];

      // Experience filter
      const meetsExperience = doctor.experience >= minExperience;

      // Gender filter
      const meetsGender =
        selectedGender === "All" ||
        doctor.gender === selectedGender.toLowerCase();

      return withinPriceRange && meetsExperience && meetsGender;
    });

    setFilteredDoctors(filtered);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "#4CAF50";
      case "busy":
        return "#FF9800";
      case "offline":
        return "#F44336";
      default:
        return textSecondaryColor;
    }
  };

  const handleDoctorAction = (doctor: Doctor, action: "book" | "view") => {
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

  const renderDoctor = ({ item: doctor }: { item: Doctor }) => (
    <TouchableOpacity
      onPress={() => router.push(`/doctors/${doctor.id}`)}
      activeOpacity={0.9}
    >
      <ChironCard style={styles.doctorCard} variant="default">
        <View style={styles.doctorContent}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorImageContainer}>
              <Animated.Image
                source={{ uri: doctor.image }}
                style={styles.doctorImage}
                defaultSource={require("@/assets/images/icon.png")}
                sharedTransitionTag={`doctor-image-${doctor.id}`}
              />
              <View
                style={[
                  styles.availabilityDot,
                  {
                    backgroundColor: getAvailabilityColor(doctor.availability),
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
                  {doctor.name}
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
              {doctor.hospital}
            </Text>
          </View>

          <Divider />

          <View style={styles.bottomSection}>
            <View style={styles.feeContainer}>
              <Text style={[styles.feeLabel, { color: textSecondaryColor }]}>
                Consultation
              </Text>
              <Text style={[styles.fee, { color: textColor }]}>
                K{doctor.consultationFee}
              </Text>
            </View>
            <ChironButton
              title={
                doctor.availability === "available"
                  ? "Book Now"
                  : "View Profile"
              }
              onPress={() =>
                handleDoctorAction(
                  doctor,
                  doctor.availability === "available" ? "book" : "view"
                )
              }
              size="small"
              variant={
                doctor.availability === "available" ? "primary" : "outline"
              }
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

      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: textColor }]}>
          {filteredDoctors.length} doctors found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: primaryColor }]}>
            Sort by rating
          </Text>
          <Ionicons name="chevron-down" size={16} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDoctors}
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

      <ChironBottomSheet ref={bottomSheetRef}>
        {isBottomSheetVisible && selectedDoctor && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.doctorDetailHeader}>
                <Animated.Image
                  source={{ uri: selectedDoctor.image }}
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
                      {selectedDoctor.name}
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
                    {selectedDoctor.hospital}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Specializations
                </Text>
                <View style={styles.tagsRow}>
                  {selectedDoctor.tags.map((tag, index) => (
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
                  Availability
                </Text>
                <View style={styles.availabilityRow}>
                  <View
                    style={[
                      styles.availabilityIndicator,
                      {
                        backgroundColor: getAvailabilityColor(
                          selectedDoctor.availability
                        ),
                      },
                    ]}
                  />
                  <Text style={[styles.availabilityText, { color: textColor }]}>
                    {selectedDoctor.availability === "available"
                      ? "Available now"
                      : selectedDoctor.availability === "busy"
                      ? "Busy - Next available slot in 2 hours"
                      : "Offline"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Consultation Fee
                </Text>
                <Text style={[styles.feeText, { color: textColor }]}>
                  K{selectedDoctor.consultationFee}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.bottomSheetActions}>
              <ChironButton
                title="Close"
                onPress={() => {
                  console.log("Close button pressed");
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
                  console.log("Action button pressed:", actionType);
                  bottomSheetRef.current?.close();
                  setIsBottomSheetVisible(false);

                  // Navigate to doctor details page for both actions
                  if (selectedDoctor) {
                    router.push(`/doctors/${selectedDoctor.id}`);
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
    paddingTop: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    padding: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  specialtiesContainer: {
    marginBottom: 16,
    height: 40,
  },
  specialtiesContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
    alignItems: "center",
  },
  specialtyChip: {
    marginRight: 8,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
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
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  doctorCard: {
    marginBottom: 16,
    minHeight: 180,
    borderColor: grayLightBorder,
    borderRadius: 10,
    borderWidth: 1,
  },
  doctorContent: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  doctorImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
  },
  availabilityDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  experience: {
    fontSize: 12,
    marginLeft: 4,
  },
  hospitalInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  hospital: {
    fontSize: 14,
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
    paddingTop: 3,
  },
  feeContainer: {
    flex: 1,
  },
  feeLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  fee: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    minWidth: 100,
  },
  // Bottom Sheet Styles
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSheetHeader: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  doctorDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomSheetDoctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    marginRight: 16,
  },
  bottomSheetDoctorInfo: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  bottomSheetDoctorName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomSheetSpecialty: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  bottomSheetRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bottomSheetRatingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 16,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
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
    gap: 8,
  },
  tagChip: {
    marginBottom: 4,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    gap: 12,
    paddingTop: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterScroll: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 32,
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
    height: 40,
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  genderChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  genderChip: {
    minWidth: 70,
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 2,
  },
});
