import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import Divider from "@/components/Divider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AppointmentStore } from "@/store/AppointmentStore";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { appointments } = AppointmentStore();

  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");

  // Find the appointment by ID
  const appointment = appointments.find((apt) => apt.id === id);

  if (!appointment) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Appointment Details
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name="calendar-outline"
            size={64}
            color={textSecondaryColor}
          />
          <Text style={[styles.errorText, { color: textColor }]}>
            Appointment not found
          </Text>
          <ChironButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "cancelled":
        return "#F44336";
      case "completed":
        return "#2196F3";
      default:
        return textSecondaryColor;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "checkmark-circle";
      case "pending":
        return "time";
      case "cancelled":
        return "close-circle";
      case "completed":
        return "checkmark-done-circle";
      default:
        return "help-circle";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    // If it's already formatted like "Morning", "Afternoon", return as is
    if (timeString.match(/^(Morning|Afternoon|Evening)$/i)) {
      return timeString;
    }
    // Otherwise try to format as time
    try {
      const time = new Date(`2000-01-01 ${timeString}`);
      return time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment? This action cannot be undone.",
      [
        {
          text: "Keep Appointment",
          style: "cancel",
        },
        {
          text: "Cancel Appointment",
          style: "destructive",
          onPress: () => {
            // Implement cancel appointment logic here
            console.log("Cancelling appointment:", appointment.id);
            Alert.alert(
              "Appointment Cancelled",
              "Your appointment has been cancelled successfully.",
              [{ text: "OK", onPress: () => router.back() }]
            );
          },
        },
      ]
    );
  };

  const handleRescheduleAppointment = () => {
    // Navigate to reschedule screen or open reschedule modal
    console.log("Reschedule appointment:", appointment.id);
    Alert.alert(
      "Reschedule Appointment",
      "Rescheduling functionality will be available soon.",
      [{ text: "OK" }]
    );
  };

  const handleJoinAppointment = () => {
    if (appointment.appointmentStatus.toLowerCase() === "confirmed") {
      // Navigate to video call or show join instructions
      console.log("Joining appointment:", appointment.id);
      Alert.alert(
        "Join Appointment",
        "Virtual appointment functionality will be available soon.",
        [{ text: "OK" }]
      );
    }
  };

  const canCancelOrReschedule = () => {
    const status = appointment.appointmentStatus.toLowerCase();
    return status === "pending" || status === "confirmed";
  };

  const canJoin = () => {
    const status = appointment.appointmentStatus.toLowerCase();
    const appointmentDate = new Date(appointment.appointmentDate);
    const now = new Date();
    const diffInHours =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 3600);

    return status === "confirmed" && diffInHours <= 1 && diffInHours >= -1;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Appointment Details
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: `${getStatusColor(
                appointment.appointmentStatus
              )}20`,
            },
          ]}
        >
          <Ionicons
            name={getStatusIcon(appointment.appointmentStatus) as any}
            size={20}
            color={getStatusColor(appointment.appointmentStatus)}
          />
          <Text
            style={[
              styles.statusBannerText,
              { color: getStatusColor(appointment.appointmentStatus) },
            ]}
          >
            {appointment.appointmentStatus.charAt(0).toUpperCase() +
              appointment.appointmentStatus.slice(1)}
          </Text>
        </View>

        {/* Appointment Info */}
        <ChironCard style={styles.infoCard} variant="default">
          <View style={styles.infoHeader}>
            <FontAwesome name="stethoscope" size={24} color={primaryColor} />
            <Text style={[styles.infoTitle, { color: textColor }]}>
              Medical Consultation
            </Text>
          </View>

          <Divider />

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color={primaryColor} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: textSecondaryColor }]}>
                  Date
                </Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {formatDate(appointment.appointmentDate)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time" size={20} color={primaryColor} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: textSecondaryColor }]}>
                  Time
                </Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {appointment.appointmentTime === null || undefined
                    ? formatTime(appointment.appointmentTime)
                    : "Not confirmed"}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time" size={20} color={primaryColor} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: textSecondaryColor }]}>
                  Time Slots
                </Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {appointment.appointmentTimeSlots.join(', ')}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="location" size={20} color={primaryColor} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: textSecondaryColor }]}>
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {appointment.appointmentLocation ||
                    "Location to be determined"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="medical" size={20} color={primaryColor} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: textSecondaryColor }]}>
                  Appointment ID
                </Text>
                <Text style={[styles.infoValue, { color: textColor }]}>
                  {appointment.id}
                </Text>
              </View>
            </View>
          </View>
        </ChironCard>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Quick Actions
          </Text>

          <View style={styles.actionButtons}>
            {canJoin() && (
              <ChironButton
                title="Join Appointment"
                onPress={handleJoinAppointment}
                variant="primary"
                style={styles.actionButton}
              />
            )}

            {canCancelOrReschedule() && (
              <>
                <ChironButton
                  title="Reschedule"
                  onPress={handleRescheduleAppointment}
                  variant="outline"
                  style={styles.actionButton}
                />
                <ChironButton
                  title="Cancel"
                  onPress={handleCancelAppointment}
                  variant="danger"
                  style={styles.actionButton}
                />
              </>
            )}
          </View>
        </View>

        {/* Instructions */}
        <ChironCard style={styles.instructionsCard} variant="default">
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Appointment Instructions
          </Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <MaterialIcons
                name="check-circle"
                size={16}
                color={primaryColor}
              />
              <Text
                style={[styles.instructionText, { color: textSecondaryColor }]}
              >
                Please arrive 15 minutes before your scheduled time
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons
                name="check-circle"
                size={16}
                color={primaryColor}
              />
              <Text
                style={[styles.instructionText, { color: textSecondaryColor }]}
              >
                Bring your ID and any relevant medical documents
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons
                name="check-circle"
                size={16}
                color={primaryColor}
              />
              <Text
                style={[styles.instructionText, { color: textSecondaryColor }]}
              >
                Wear comfortable clothing and a mask
              </Text>
            </View>
          </View>
        </ChironCard>

        <View style={styles.bottomPadding} />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  statusBannerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  instructionsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  bottomPadding: {
    height: 50,
  },
});
