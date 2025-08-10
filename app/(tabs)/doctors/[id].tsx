import ChironBottomSheet, {
  ChironBottomSheetHandles,
} from "@/components/ChironBottomSheet";
import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { ChironChip } from "@/components/ChironChip";
import Divider from "@/components/Divider";
import { grayLightBorder, grayMediumBorder } from "@/constants/Colors";
import { CardStyles, textStyles } from "@/constants/GlobalStyles";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Doctor } from "@/types";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Mock data - in a real app, this would come from API based on the ID
const mockDoctor: Doctor = {
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
  tags: ["Heart Specialist", "Emergency Care", "Pediatric Cardiology"],
  isVerified: true,
  gender: "female",
};

const reviews = [
  {
    id: "1",
    patientName: "John D.",
    rating: 5,
    comment:
      "Excellent doctor! Very professional and caring. Explained everything clearly.",
    date: "2 weeks ago",
  },
  {
    id: "2",
    patientName: "Sarah M.",
    rating: 4,
    comment:
      "Great experience. Wait time was minimal and the doctor was very thorough.",
    date: "1 month ago",
  },
  {
    id: "3",
    patientName: "Michael R.",
    rating: 5,
    comment:
      "Dr. Johnson is amazing! She helped me with my heart condition and I feel much better.",
    date: "2 months ago",
  },
];

// Available dates for the next 7 days
const getAvailableDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    const fullDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format

    dates.push({
      id: fullDate,
      day: dayName,
      date: dayNumber,
      month: monthName,
      fullDate: fullDate,
      isToday: i === 0,
    });
  }

  return dates;
};

// Available time slots for each session
const availableTimeSlots = {
  morning: {
    label: "Morning",
    time: "05:00 - 10:00",
    icon: "sunny-outline",
    slots: ["05:00", "06:00", "07:00", "08:00", "09:00", "10:00"],
  },
  afternoon: {
    label: "Afternoon",
    time: "12:00 - 17:00",
    icon: "partly-sunny-outline",
    slots: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  },
  evening: {
    label: "Evening",
    time: "18:00 - 21:00",
    icon: "moon-outline",
    slots: ["18:00", "19:00", "20:00", "21:00"],
  },
};

export default function DoctorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const scrollY = useSharedValue(0);
  const bottomSheetRef = useRef<ChironBottomSheetHandles>(null);

  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");

  const handleOpenActionSheet = () => {
    setIsActionSheetVisible(true);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    bottomSheetRef.current?.open(2);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  // Animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 200],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Animated styles for image
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 300],
      [1, 1.2],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -100],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={[styles.container]}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={[styles.headerContent, { backgroundColor: surfaceColor }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text
            style={[styles.headerTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {mockDoctor.name}
          </Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color={primaryColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Doctor Image */}
        <View style={styles.imageSection}>
          <Animated.Image
            source={{ uri: mockDoctor.image }}
            style={[styles.doctorImage, imageAnimatedStyle]}
            sharedTransitionTag={`doctor-image-${mockDoctor.id}`}
          />

          {/* Overlay controls */}
          <View style={styles.imageOverlay}>
            <TouchableOpacity
              style={styles.backButtonOverlay}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.favoriteButtonOverlay}>
              <Ionicons name="heart-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name of Doctor */}
        <View style={styles.nameSection}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <FontAwesome
                  name="stethoscope"
                  size={20}
                  color={primaryColor}
                />
                <Text style={[styles.institutionText, { color: primaryColor }]}>
                  {mockDoctor.hospital}
                </Text>
              </View>

              <View style={styles.nameRow}>
                <Text style={[styles.doctorName, { color: textColor }]}>
                  {mockDoctor.name}
                </Text>
                {mockDoctor.isVerified && (
                  <MaterialIcons
                    name="verified"
                    size={20}
                    color={primaryColor}
                  />
                )}
              </View>
            </View>
            <ChironButton
              title="Message"
              onPress={handleOpenActionSheet}
              variant="primary"
              style={{ maxHeight: 45 }}
            />
          </View>

          <Text style={[styles.specialty, { color: primaryColor }]}>
            {mockDoctor.specialty}
          </Text>

          <View style={styles.availabilityContainer}>
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: getAvailabilityColor(
                    mockDoctor.availability
                  ),
                },
              ]}
            />
            <Text style={[styles.availabilityText, { color: textColor }]}>
              Available now
            </Text>
          </View>
        </View>

        {/* Experience - Review Rating */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statInerStyle}>
                <SimpleLineIcons
                  name="handbag"
                  size={20}
                  color={grayMediumBorder}
                />
                <Text style={[styles.statNumber, { color: textColor }]}>
                  {mockDoctor.experience} years
                </Text>
              </View>

              <Text style={[styles.statLabel, { color: textSecondaryColor }]}>
                Work Experience
              </Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statInerStyle}>
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={grayMediumBorder}
                />
                <Text style={[styles.statNumber, { color: textColor }]}>
                  {mockDoctor.rating}
                </Text>
              </View>

              <Text style={[styles.statLabel, { color: textSecondaryColor }]}>
                Reviews (127)
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            About Doctor
          </Text>

          <Text style={[styles.aboutText, { color: textSecondaryColor }]}>
            Dr. Sarah Johnson is a highly experienced cardiologist with over 12
            years of practice. She specializes in preventive cardiology, heart
            disease management, and emergency cardiac care. Dr. Johnson is known
            for her compassionate approach to patient care and her expertise in
            the latest cardiac treatment methods.
            {"\n\n"}
            She completed her medical degree from Harvard Medical School and her
            cardiology residency at Johns Hopkins Hospital. Dr. Johnson is
            board-certified and a member of the American College of Cardiology.
          </Text>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Specializations
          </Text>
          <View style={styles.specializationsContainer}>
            {mockDoctor.tags.map((tag, index) => (
              <ChironChip
                key={index}
                label={tag}
                size="small"
                style={styles.specializationChip}
              />
            ))}
          </View>
        </View>

        {/* Working Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Working Hours
          </Text>
          <ChironCard style={styles.workingHoursCard} variant="default">
            {[
              { day: "Monday", hours: "9:00 AM - 5:00 PM" },
              { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
              { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
              { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
              { day: "Friday", hours: "9:00 AM - 3:00 PM" },
              { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
              { day: "Sunday", hours: "Closed" },
            ].map((schedule, index) => (
              <View key={index} style={styles.scheduleRow}>
                <Text style={[styles.scheduleDay, { color: textColor }]}>
                  {schedule.day}
                </Text>
                <Text
                  style={[
                    styles.scheduleHours,
                    {
                      color:
                        schedule.hours === "Closed"
                          ? "#F44336"
                          : textSecondaryColor,
                    },
                  ]}
                >
                  {schedule.hours}
                </Text>
              </View>
            ))}
          </ChironCard>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Reviews (127)
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: primaryColor }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {reviews.slice(0, 3).map((review) => (
            <ChironCard
              key={review.id}
              style={styles.reviewCard}
              variant="default"
            >
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewerName, { color: textColor }]}>
                  {review.patientName}
                </Text>
                <Text
                  style={[styles.reviewDate, { color: textSecondaryColor }]}
                >
                  {review.date}
                </Text>
              </View>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
              <Text
                style={[styles.reviewComment, { color: textSecondaryColor }]}
              >
                {review.comment}
              </Text>
            </ChironCard>
          ))}
        </View>

        {/* Bottom padding for floating button */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <ChironBottomSheet
        handleVisible={false}
        initialIndex={1}
        snapPoints={["10%"]}
        panDownClose={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View>
            <Text style={{ color: grayMediumBorder }}>Consultation fee</Text>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>K150</Text>
          </View>

          <ChironButton
            title="Schedule Appointment"
            onPress={handleOpenActionSheet}
            variant="primary"
            style={styles.bookButton}
          />
        </View>
      </ChironBottomSheet>

      {/* Bottom Sheet */}
      <ChironBottomSheet ref={bottomSheetRef}>
        {isActionSheetVisible && (
          <View style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: textColor }]}>
                Schedule
              </Text>
              <TouchableOpacity onPress={handleCloseActionSheet}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
            {/* Appointment With */}
            <View style={[CardStyles.outlinedCard, { gap: 5 }]}>
              <Text
                style={{ fontSize: textStyles.fontSize.sm, fontWeight: "bold" }}
              >
                Appointment With
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View
                  style={[
                    CardStyles.outlinedCard,
                    {
                      width: 55,
                      height: 55,
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <Image
                    source={{ uri: "https://github.com/namycodes.png" }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: textStyles.fontSize.sm,
                      fontWeight: "bold",
                    }}
                  >
                    {mockDoctor.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: textStyles.fontSize.sm,
                      color: primaryColor,
                    }}
                  >
                    {mockDoctor.hospital}
                  </Text>
                </View>
              </View>
              <Divider />
              {/* Appointment Location */}
              <Text
                style={{ fontSize: textStyles.fontSize.sm, fontWeight: "bold" }}
              >
                Appointment Location
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <View style={styles.outlinedCard}>
                  <Ionicons
                    size={20}
                    name="location-outline"
                    color={primaryColor}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: textStyles.fontSize.sm,
                      fontWeight: "bold",
                    }}
                  >
                    {mockDoctor.hospital}
                  </Text>
                  <Text
                    style={{
                      fontSize: textStyles.fontSize.sm,
                      color: textStyles.textColor.subHeading2,
                    }}
                  >
                    Chalala, Lusaka
                  </Text>
                </View>
              </View>
            </View>

            <Divider />

            {/* Date Selection */}
            <View style={styles.availableSlotsSection}>
              <Text style={[styles.slotsTitle, { color: textColor }]}>
                Select Date
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.datesContainer}
                contentContainerStyle={styles.datesContent}
              >
                {getAvailableDates().map((dateItem) => (
                  <TouchableOpacity
                    key={dateItem.id}
                    style={[
                      styles.dateButton,
                      {
                        backgroundColor:
                          selectedDate === dateItem.id
                            ? primaryColor
                            : surfaceColor,
                        borderColor:
                          selectedDate === dateItem.id
                            ? primaryColor
                            : borderColor,
                      },
                    ]}
                    onPress={() => {
                      setSelectedDate(dateItem.id);
                      setSelectedTimeSlot(null); // Reset time slot when date changes
                    }}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        {
                          color:
                            selectedDate === dateItem.id
                              ? "white"
                              : textSecondaryColor,
                          fontSize: 12,
                        },
                      ]}
                    >
                      {dateItem.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNumber,
                        {
                          color:
                            selectedDate === dateItem.id ? "white" : textColor,
                          fontWeight: "bold",
                          fontSize: 16,
                        },
                      ]}
                    >
                      {dateItem.date}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        {
                          color:
                            selectedDate === dateItem.id
                              ? "white"
                              : textSecondaryColor,
                          fontSize: 11,
                        },
                      ]}
                    >
                      {dateItem.month}
                    </Text>
                    {dateItem.isToday && (
                      <View
                        style={[
                          styles.todayDot,
                          {
                            backgroundColor:
                              selectedDate === dateItem.id
                                ? "white"
                                : primaryColor,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time Sessions Selection */}
            {selectedDate && (
              <View style={styles.availableSlotsSection}>
                <Text style={[styles.slotsTitle, { color: textColor }]}>
                  Available Sessions
                </Text>
                <View style={styles.sessionsContainer}>
                  {Object.entries(availableTimeSlots).map(([key, session]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.sessionButton,
                        {
                          backgroundColor:
                            selectedTimeSlot === key
                              ? primaryColor
                              : surfaceColor,
                          borderColor:
                            selectedTimeSlot === key
                              ? primaryColor
                              : borderColor,
                        },
                      ]}
                      onPress={() => setSelectedTimeSlot(key)}
                    >
                      <View style={styles.sessionHeader}>
                        <Ionicons
                          name={session.icon as any}
                          size={20}
                          color={
                            selectedTimeSlot === key ? "white" : primaryColor
                          }
                        />
                        <Text
                          style={[
                            styles.sessionLabel,
                            {
                              color:
                                selectedTimeSlot === key ? "white" : textColor,
                              fontWeight: "600",
                              marginLeft: 8,
                            },
                          ]}
                        >
                          {session.label}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.sessionTime,
                          {
                            color:
                              selectedTimeSlot === key
                                ? "white"
                                : textSecondaryColor,
                            fontSize: 13,
                            marginTop: 4,
                          },
                        ]}
                      >
                        {session.time}
                      </Text>
                      {selectedTimeSlot === key && (
                        <View style={styles.timeSlots}>
                          {session.slots.map((slot, index) => (
                            <View key={index} style={styles.timeSlot}>
                              <Text
                                style={[
                                  styles.timeSlotText,
                                  { color: "white", fontSize: 12 },
                                ]}
                              >
                                {slot}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.bottomSheetActions}>
              <ChironButton
                title="Message"
                onPress={() => {
                  handleCloseActionSheet();
                  // Navigate to chat
                }}
                variant="outline"
                style={styles.messageButton}
              />

              <ChironButton
                title={
                  selectedDate && selectedTimeSlot
                    ? "Confirm Appointment"
                    : "Select Date & Time"
                }
                onPress={() => {
                  if (selectedDate && selectedTimeSlot) {
                    handleCloseActionSheet();
                    // Navigate to booking confirmation
                    console.log(
                      "Booking appointment for:",
                      selectedDate,
                      selectedTimeSlot
                    );
                  }
                }}
                variant="primary"
                style={{
                  ...styles.scheduleButton,
                  opacity: selectedDate && selectedTimeSlot ? 1 : 0.5,
                }}
                disabled={!selectedDate || !selectedTimeSlot}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === "ios" ? 44 : 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    height: 350,
    position: "relative",
  },
  doctorImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
  },
  backButtonOverlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonOverlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  institutionSection: {
    marginTop: -30,
    marginHorizontal: 20,
    zIndex: 100,
  },
  institutionCard: {
    marginBottom: 16,
  },
  institutionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  institutionText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 14,
    marginLeft: 4,
  },
  nameSection: {
    paddingTop: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  specialty: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: "500",
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  statItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: grayLightBorder,
    borderRadius: 10,
    padding: 15,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  statInerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  aboutCard: {
    padding: 20,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  specializationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specializationChip: {
    marginBottom: 8,
  },
  workingHoursCard: {
    borderWidth: 1,
    padding: 16,
    borderColor: grayLightBorder,
    borderRadius: 10,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  scheduleDay: {
    fontSize: 16,
    fontWeight: "500",
  },
  scheduleHours: {
    fontSize: 16,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  reviewCard: {
    borderColor: grayLightBorder,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
  floatingButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bookButton: {
    marginBottom: Platform.OS === "ios" ? 20 : 0,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
      paddingBottom: 20,
    gap: 8
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
  },
  availableSlotsSection: {
    marginBottom: 30,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  slotsText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bottomSheetActions: {
    flexDirection: "row",
    gap: 12,
  },
  messageButton: {
    flex: 1,
  },
  scheduleButton: {
    flex: 2,
  },
  outlinedCard: {
    borderColor: grayLightBorder,
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
  },
  datesContainer: {
    marginBottom: 16,
  },
  datesContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dateDay: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 11,
  },
  todayDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sessionsContainer: {
    gap: 12,
  },
  sessionButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  sessionTime: {
    fontSize: 13,
    marginTop: 4,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  timeSlot: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
