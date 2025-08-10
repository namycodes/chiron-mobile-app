import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Feather,
  EvilIcons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, grayLightBorder, grayMediumBorder } from "@/constants/Colors";
import { useState } from "react";
import { router } from "expo-router";

interface categoriesProps {
  name: string;
  icon: React.ReactNode;
}

interface HealthPersonnelProps {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  isVerified: boolean;
}

interface PharmacyProps {
  id: number;
  name: string;
  location: string;
  rating: number;
  distance: string;
  image: string;
  isVerified: boolean;
  isOpen: boolean;
}

const initialCategories = [
  {
    name: "Doctor",
    icon: (
      <FontAwesome name="stethoscope" size={20} color={Colors.light.primary} />
    ),
  },
  {
    name: "Appointment",
    icon: <Feather name="calendar" size={20} color={Colors.light.primary} />,
  },
  {
    name: "Pharmacy",
    icon: (
      <MaterialCommunityIcons
        name="pill"
        size={20}
        color={Colors.light.primary}
      />
    ),
  },
  {
    name: "Hospital",
    icon: (
      <FontAwesome5 name="hospital" size={20} color={Colors.light.primary} />
    ),
  },
];

const topHealthPersonnel: HealthPersonnelProps[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "12 years",
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    rating: 4.8,
    experience: "8 years",
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    rating: 4.9,
    experience: "10 years",
    isVerified: false,
    image:
      "https://images.unsplash.com/photo-1594824375467-b1ef7c8a78c7?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    specialty: "Orthopedic",
    rating: 4.7,
    experience: "15 years",
    isVerified: true,
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
  },
];

const topPharmacies: PharmacyProps[] = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    location: "Cairo Road, Lusaka",
    rating: 4.8,
    distance: "0.5 km",
    isVerified: true,
    isOpen: true,
    image:
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "MediCare Central",
    location: "Independence Ave",
    rating: 4.9,
    distance: "1.2 km",
    isVerified: true,
    isOpen: true,
    image:
      "https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "PharmaCare Express",
    location: "Manda Hill Mall",
    rating: 4.7,
    distance: "2.1 km",
    isVerified: false,
    isOpen: false,
    image:
      "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "WellCare Pharmacy",
    location: "Woodlands Mall",
    rating: 4.6,
    distance: "3.0 km",
    isVerified: true,
    isOpen: true,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=150&h=150&fit=crop",
  },
];

export default function HomeScreen() {
  const [categories, setCategories] =
    useState<categoriesProps[]>(initialCategories);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        {/* Header with Location */}
        <View style={styles.header}>
          <View style={styles.locationView}>
            <EvilIcons name="location" size={20} color={Colors.light.primary} />
            <Text style={styles.locationText}>Lusaka, Zambia</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon}>
            <Feather name="bell" size={22} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Good Morning!</Text>
          <Text style={styles.welcomeSubtext}>How can we help you today?</Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Feather
            name="search"
            size={20}
            color="#888"
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Search for doctors, pharmacy, medicines..."
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, idx) => (
              <TouchableOpacity key={idx} style={styles.categoryCard}>
                <View style={styles.categoryIconContainer}>
                  {category.icon}
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Health Personnel */}
        <View style={styles.personnelSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Health Personnel</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.personnelContainer}
          >
            {topHealthPersonnel.map((person) => (
              <TouchableOpacity
                onPress={() => router.push(`/(tabs)/doctors/${person.id}`)}
                key={person.id}
                style={styles.personnelCard}
              >
                <View style={styles.personnelImageContainer}>
                  <Image
                    source={{ uri: person.image }}
                    style={styles.personnelImage}
                    defaultSource={{
                      uri: "https://via.placeholder.com/80x80/E8E8E8/666?text=Doctor",
                    }}
                  />
                  <View style={{ height: 10 }} />
                  {person.isVerified ? (
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
                        color={Colors.light.primary}
                      />
                      <Text style={{ fontSize: 12 }}>Verified</Text>
                    </View>
                  ) : null}

                  <View style={{ height: 10 }} />
                  <View style={styles.ratingBadge}>
                    <FontAwesome name="star" size={10} color="#FFD700" />
                    <Text style={styles.ratingText}>{person.rating}</Text>
                  </View>
                </View>
                <Text style={styles.personnelName} numberOfLines={1}>
                  {person.name}
                </Text>
                <Text style={styles.personnelSpecialty} numberOfLines={1}>
                  {person.specialty}
                </Text>
                <Text style={styles.personnelExperience}>
                  Experience: {person.experience}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Top Pharmacies */}
        <View style={styles.personnelSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Pharmacies</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.personnelContainer}
          >
            {topPharmacies.map((pharmacy) => (
              <TouchableOpacity key={pharmacy.id} style={styles.pharmacyCard}>
                <View style={styles.pharmacyImageContainer}>
                  <Image
                    source={{ uri: pharmacy.image }}
                    style={styles.pharmacyImage}
                    defaultSource={{
                      uri: "https://via.placeholder.com/80x80/E8E8E8/666?text=Pharmacy",
                    }}
                  />
                  {pharmacy.isOpen ? (
                    <View style={styles.openBadge}>
                      <Text style={styles.openText}>Open</Text>
                    </View>
                  ) : (
                    <View style={styles.closedBadge}>
                      <Text style={styles.closedText}>Closed</Text>
                    </View>
                  )}
                </View>

                <View style={styles.pharmacyInfo}>
                  <View style={styles.pharmacyNameRow}>
                    <Text style={styles.pharmacyName} numberOfLines={1}>
                      {pharmacy.name}
                    </Text>
                    {pharmacy.isVerified && (
                      <MaterialIcons
                        name="verified"
                        size={16}
                        color={Colors.light.primary}
                      />
                    )}
                  </View>

                  <View style={styles.pharmacyLocationRow}>
                    <EvilIcons name="location" size={16} color="#666" />
                    <Text style={styles.pharmacyLocation} numberOfLines={1}>
                      {pharmacy.location}
                    </Text>
                  </View>

                  <View style={styles.pharmacyDetailsRow}>
                    <View style={styles.ratingContainer}>
                      <FontAwesome name="star" size={12} color="#FFD700" />
                      <Text style={styles.pharmacyRating}>
                        {pharmacy.rating}
                      </Text>
                    </View>
                    <Text style={styles.pharmacyDistance}>
                      {pharmacy.distance}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  locationView: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  notificationIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#666",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderColor: grayLightBorder,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  categoryIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f9f8f8",
    width: 72,
    height: 72,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.primary,
    textAlign: "center",
  },
  personnelSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  viewAllText: {
    color: Colors.light.tint,
    fontWeight: "600",
    fontSize: 16,
  },
  personnelContainer: {
    paddingHorizontal: 16,
  },
  personnelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    width: 230,
    height: 230,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderColor: grayLightBorder,
    borderWidth: 1,
  },
  personnelImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  personnelImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  ratingBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 2,
  },
  personnelName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  personnelSpecialty: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "500",
    marginBottom: 4,
  },
  personnelExperience: {
    fontSize: 12,
    color: "#888",
  },
  emergencySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },

  // Pharmacy styles
  pharmacyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    width: 260,
    borderColor: grayLightBorder,
    borderWidth: 1,
  },
  pharmacyImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  pharmacyImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  openBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  openText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  closedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF5722",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  pharmacyLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pharmacyLocation: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  pharmacyDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pharmacyRating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  pharmacyDistance: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "500",
  },
});
