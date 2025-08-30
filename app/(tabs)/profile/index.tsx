import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { grayLightBorder } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AuthStore } from "@/store/AuthStore";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Mock user data - in a real app, this would come from user context/API
const mockUser = {
  id: "user_123",
  name: "Sarah Williams",
  email: "sarah.williams@email.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "March 15, 1992",
  gender: "Female",
  bloodType: "O+",
  address: "123 Main St, City, State 12345",
  profileImage: "https://via.placeholder.com/150x150",
  emergencyContact: {
    name: "John Williams",
    relationship: "Husband",
    phone: "+1 (555) 987-6543",
  },
  medicalInfo: {
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Diabetes Type 2"],
    medications: ["Metformin", "Lisinopril"],
  },
  stats: {
    appointments: 24,
    prescriptions: 8,
    reports: 12,
    consultations: 16,
  },
};

export default function Profile() {
  const router = useRouter();
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const {logout} = AuthStore()

  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const backgroundColor = useThemeColor({}, "background");
  const backgroundSecondaryColor = useThemeColor({}, "backgroundSecondary");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress:async () => {
          await logout()
          router.replace("/(auth)/signin")
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen (placeholder)
    console.log("Navigate to edit profile");
  };

  const ProfileMenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showBorder = true,
    iconColor = textSecondaryColor,
    rightElement,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showBorder?: boolean;
    iconColor?: string;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.menuItem,
          showBorder && {
            borderBottomWidth: 1,
            borderBottomColor: grayLightBorder,
          },
        ]}
      >
        <View style={styles.menuItemLeft}>
          <View
            style={[
              styles.menuIconContainer,
              { backgroundColor: backgroundSecondaryColor },
            ]}
          >
            {icon}
          </View>
          <View style={styles.menuItemContent}>
            <Text style={[styles.menuTitle, { color: textColor }]}>
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[styles.menuSubtitle, { color: textSecondaryColor }]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement || (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={textSecondaryColor}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const StatsCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
  }) => (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
      <ChironCard style={styles.statsCardInner} variant="default">
        <View
          style={[styles.statsIconContainer, { backgroundColor: `${color}15` }]}
        >
          {icon}
        </View>
        <Text style={[styles.statsValue, { color: textColor }]}>{value}</Text>
        <Text style={[styles.statsLabel, { color: textSecondaryColor }]}>
          {label}
        </Text>
      </ChironCard>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Profile Image */}
        <Animated.View
          entering={FadeInUp}
          style={[styles.header, { backgroundColor: surfaceColor }]}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: mockUser.profileImage }}
                style={styles.profileImage}
                defaultSource={require("@/assets/images/icon.png")}
              />
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: primaryColor }]}
                onPress={() => console.log("Change profile picture")}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: textColor }]}>
                {mockUser.name}
              </Text>
              <Text style={[styles.userEmail, { color: textSecondaryColor }]}>
                {mockUser.email}
              </Text>
              <View style={styles.verificationBadge}>
                <MaterialIcons name="verified" size={16} color={primaryColor} />
                <Text style={[styles.verifiedText, { color: primaryColor }]}>
                  Verified Account
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Feather name="edit-2" size={20} color={primaryColor} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.statsSection}
        >
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Health Overview
          </Text>
          <View style={styles.statsGrid}>
            <StatsCard
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={primaryColor}
                />
              }
              label="Appointments"
              value={mockUser.stats.appointments}
              color={primaryColor}
            />
            <StatsCard
              icon={
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color="#4CAF50"
                />
              }
              label="Prescriptions"
              value={mockUser.stats.prescriptions}
              color="#4CAF50"
            />
            <StatsCard
              icon={
                <Ionicons name="analytics-outline" size={24} color="#FF9800" />
              }
              label="Reports"
              value={mockUser.stats.reports}
              color="#FF9800"
            />
            <StatsCard
              icon={
                <Ionicons name="chatbubble-outline" size={24} color="#9C27B0" />
              }
              label="Consultations"
              value={mockUser.stats.consultations}
              color="#9C27B0"
            />
          </View>
        </Animated.View>

        {/* Personal Information Section */}
        <Animated.View entering={SlideInLeft.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Personal Information
          </Text>
          <ChironCard style={styles.menuCard} variant="default">
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Personal Details"
              subtitle="Name, DOB, Gender, Address"
              onPress={() => console.log("Navigate to personal details")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons name="call-outline" size={20} color={primaryColor} />
              }
              title="Contact Information"
              subtitle={mockUser.phone}
              onPress={() => console.log("Navigate to contact info")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Emergency Contact"
              subtitle={mockUser.emergencyContact.name}
              onPress={() => console.log("Navigate to emergency contact")}
              showBorder={false}
            />
          </ChironCard>
        </Animated.View>

        {/* Medical Information Section */}
        <Animated.View
          entering={SlideInRight.delay(300)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Medical Information
            </Text>
            <TouchableOpacity
              onPress={() => setShowMedicalInfo(!showMedicalInfo)}
              style={styles.toggleButton}
            >
              <Ionicons
                name={showMedicalInfo ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={textSecondaryColor}
              />
            </TouchableOpacity>
          </View>

          <ChironCard style={styles.menuCard} variant="default">
            <ProfileMenuItem
              icon={<FontAwesome name="tint" size={20} color="#E53E3E" />}
              title="Blood Type"
              subtitle={showMedicalInfo ? mockUser.bloodType : "••••"}
              onPress={() => console.log("Navigate to blood type")}
            />
            <ProfileMenuItem
              icon={<MaterialIcons name="warning" size={20} color="#FF9800" />}
              title="Allergies"
              subtitle={
                showMedicalInfo
                  ? mockUser.medicalInfo.allergies.join(", ")
                  : "••••••"
              }
              onPress={() => console.log("Navigate to allergies")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons name="medical-outline" size={20} color="#4CAF50" />
              }
              title="Current Medications"
              subtitle={
                showMedicalInfo
                  ? `${mockUser.medicalInfo.medications.length} medications`
                  : "••••"
              }
              onPress={() => console.log("Navigate to medications")}
              showBorder={false}
            />
          </ChironCard>
        </Animated.View>

        {/* App Settings Section */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            App Settings
          </Text>
          <ChironCard style={styles.menuCard} variant="default">
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Notifications"
              subtitle="Push notifications, reminders"
              onPress={() => console.log("Navigate to notifications")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Privacy & Security"
              subtitle="Password, biometrics, data"
              onPress={() => console.log("Navigate to privacy")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="language-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Language & Region"
              subtitle="English (US)"
              onPress={() => console.log("Navigate to language")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons name="moon-outline" size={20} color={primaryColor} />
              }
              title="Theme"
              subtitle="Light mode"
              onPress={() => console.log("Navigate to theme")}
              showBorder={false}
            />
          </ChironCard>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Support & About
          </Text>
          <ChironCard style={styles.menuCard} variant="default">
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Help & Support"
              subtitle="FAQs, Contact us"
              onPress={() => console.log("Navigate to help")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="Terms & Privacy Policy"
              onPress={() => console.log("Navigate to terms")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons name="star-outline" size={20} color={primaryColor} />
              }
              title="Rate the App"
              onPress={() => console.log("Rate app")}
            />
            <ProfileMenuItem
              icon={
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={primaryColor}
                />
              }
              title="About Chiron"
              subtitle="Version 1.0.0"
              onPress={() => console.log("Navigate to about")}
              showBorder={false}
            />
          </ChironCard>
        </Animated.View>

        {/* Logout Section */}
        <Animated.View
          entering={FadeInDown.delay(600)}
          style={styles.logoutSection}
        >
          <ChironButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={{ color: "#E53E3E" }}
          />
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  statsCard: {
    width: (width - 60) / 2,
  },
  statsCardInner: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: grayLightBorder,
    borderRadius: 12,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuCard: {
    borderWidth: 1,
    borderColor: grayLightBorder,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  menuItemRight: {
    marginLeft: 8,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  bottomSpacing: {
    height: 40,
  },
});
