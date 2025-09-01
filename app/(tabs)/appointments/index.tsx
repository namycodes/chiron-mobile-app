import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AppointmentStore } from "@/store/AppointmentStore";
import { Appointment } from "@/types";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AppointmentCard = ({
  appointment,
  onPress,
}: {
  appointment: Appointment;
  onPress: () => void;
}) => {
  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const primaryColor = useThemeColor({}, "primary");
  const surfaceColor = useThemeColor({}, "surface");

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
      weekday: "short",
      month: "short",
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ChironCard style={styles.appointmentCard} variant="default">
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentInfo}>
            <View style={styles.appointmentTitleRow}>
              <FontAwesome
                name="stethoscope"
                size={16}
                color={primaryColor}
                style={styles.appointmentIcon}
              />
              <Text style={[styles.appointmentTitle, { color: textColor }]}>
                Medical Consultation
              </Text>
            </View>
            <Text
              style={[
                styles.appointmentLocation,
                { color: textSecondaryColor },
              ]}
            >
              {appointment.appointmentLocation || "Location not specified"}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${getStatusColor(
                  appointment.appointmentStatus
                )}20`,
              },
            ]}
          >
            <Ionicons
              name={getStatusIcon(appointment.appointmentStatus) as any}
              size={14}
              color={getStatusColor(appointment.appointmentStatus)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(appointment.appointmentStatus) },
              ]}
            >
              {appointment.appointmentStatus.charAt(0).toUpperCase() +
                appointment.appointmentStatus.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={textSecondaryColor} />
            <Text style={[styles.detailText, { color: textSecondaryColor }]}>
              {formatDate(appointment.appointmentDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={textSecondaryColor} />
            <Text style={[styles.detailText, { color: textSecondaryColor }]}>
              {appointment.appointmentTime === null || undefined
                ? formatTime(appointment.appointmentTime)
                : "Not confirmed"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={textSecondaryColor} />
            <Text style={[styles.detailText, { color: textSecondaryColor }]}>
              {appointment.appointmentLocation || "Location TBD"}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentActions}>
          {appointment.appointmentStatus.toLowerCase() === "confirmed" && (
            <ChironButton
              title="Join/View"
              onPress={onPress}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
          {appointment.appointmentStatus.toLowerCase() === "pending" && (
            <ChironButton
              title="View Details"
              onPress={onPress}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          )}
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={textSecondaryColor}
            />
          </TouchableOpacity>
        </View>
      </ChironCard>
    </TouchableOpacity>
  );
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const {
    appointments,
    appointmentsLoading,
    appointmentsFetchingError,
    getUserAppointments,
  } = AppointmentStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const textColor = useThemeColor({}, "text");
  const textSecondaryColor = useThemeColor({}, "textSecondary");
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");

  useEffect(() => {
    getUserAppointments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getUserAppointments();
    setRefreshing(false);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case "upcoming":
        return (
          appointmentDate >= today &&
          !["completed", "cancelled"].includes(
            appointment.appointmentStatus.toLowerCase()
          )
        );
      case "past":
        return (
          appointmentDate < today ||
          ["completed", "cancelled"].includes(
            appointment.appointmentStatus.toLowerCase()
          )
        );
      default:
        return true;
    }
  });

  const handleAppointmentPress = (appointment: Appointment) => {
    // Navigate to appointment details
    router.push(`/(tabs)/appointments/${appointment.id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={80} color={textSecondaryColor} />
      <Text style={[styles.emptyTitle, { color: textColor }]}>
        No Appointments Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: textSecondaryColor }]}>
        {filter === "upcoming"
          ? "You don't have any upcoming appointments."
          : filter === "past"
          ? "No past appointments found."
          : "You haven't scheduled any appointments yet. Find a doctor to get started!"}
      </Text>
      {filter === "all" && (
        <ChironButton
          title="Find Doctors"
          onPress={() => router.push("/(tabs)/doctors")}
          variant="primary"
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterTabs}>
      {["all", "upcoming", "past"].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.filterTab,
            filter === tab && { backgroundColor: primaryColor },
          ]}
          onPress={() => setFilter(tab as any)}
        >
          <Text
            style={[
              styles.filterTabText,
              {
                color: filter === tab ? "white" : textSecondaryColor,
              },
            ]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (appointmentsLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Appointments</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={[styles.loadingText, { color: textSecondaryColor }]}>
            Loading appointments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (appointmentsFetchingError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Appointments</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
          <Text style={[styles.errorText, { color: textColor }]}>
            {appointmentsFetchingError}
          </Text>
          <ChironButton
            title="Try Again"
            onPress={getUserAppointments}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Appointments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/doctors")}
        >
          <Ionicons name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onPress={() => handleAppointmentPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[primaryColor]}
            tintColor={primaryColor}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  appointmentIcon: {
    marginRight: 8,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  appointmentLocation: {
    fontSize: 14,
    marginLeft: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  appointmentDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  appointmentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    marginRight: 12,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    minWidth: 150,
  },
});
