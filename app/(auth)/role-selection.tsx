import React, { useState } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ChironButton } from "@/components/ChironButton";
import { ChironCard } from "@/components/ChironCard";
import { UserRole } from "@/types";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const primaryColor = useThemeColor({}, "primary");

  const roles = [
    {
      role: UserRole.PATIENT,
      icon: "🏥",
      title: "I'm a Patient",
      description:
        "Looking for healthcare services, medications, and appointments",
      color: "#2E86AB",
    },
    {
      role: UserRole.HEALTH_PERSONNEL,
      icon: "👨‍⚕️",
      title: "I'm a Healthcare Professional",
      description: "Doctor, nurse, or healthcare provider offering services",
      color: "#4CAF50",
    },
    {
      role: UserRole.PHARMACY,
      icon: "💊",
      title: "I'm a Pharmacy",
      description:
        "Pharmacy or drugstore selling medications and health products",
      color: "#9C27B0",
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: "/(auth)/signup",
        params: { role: selectedRole },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Choose Your Role</ThemedText>
          <ThemedText type="secondary" style={styles.subtitle}>
            How do you plan to use Chiron?
          </ThemedText>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((roleData) => {
            const isSelected = selectedRole === roleData.role;
            const selectedStyle: ViewStyle = isSelected
              ? {
                  borderColor: roleData.color,
                  borderWidth: 2,
                  backgroundColor: `${roleData.color}10`,
                }
              : {};

            return (
              <ChironCard
                key={roleData.role}
                onPress={() => setSelectedRole(roleData.role)}
                variant="outlined"
                style={[styles.roleCard, selectedStyle]}
              >
                <View style={styles.roleContent}>
                  <View style={styles.roleHeader}>
                    <View
                      style={[
                        styles.roleIcon,
                        { backgroundColor: `${roleData.color}20` },
                      ]}
                    >
                      <ThemedText style={styles.roleIconText}>
                        {roleData.icon}
                      </ThemedText>
                    </View>
                    <View style={styles.roleInfo}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.roleTitle}
                      >
                        {roleData.title}
                      </ThemedText>
                      <ThemedText
                        type="secondary"
                        style={styles.roleDescription}
                      >
                        {roleData.description}
                      </ThemedText>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <ThemedText
                        style={[styles.checkmark, { color: roleData.color }]}
                      >
                        ✓
                      </ThemedText>
                    </View>
                  )}
                </View>
              </ChironCard>
            );
          })}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <ChironButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedRole}
            size="large"
          />

          <ThemedText type="secondary" style={styles.backText}>
            Already have an account?{" "}
          </ThemedText>
          <ThemedText type="link" onPress={() => router.push("/(auth)/signin")}>
            Sign in here
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
  },
  rolesContainer: {
    flex: 1,
  },
  roleCard: {
    marginBottom: 16,
    position: "relative",
  },
  roleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleIconText: {
    fontSize: 24,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    marginBottom: 4,
  },
  roleDescription: {
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 16,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  backText: {
    marginTop: 16,
    textAlign: "center",
  },
});
