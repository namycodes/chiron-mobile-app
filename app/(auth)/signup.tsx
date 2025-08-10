import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ChironButton } from "@/components/ChironButton";
import { ChironInput } from "@/components/ChironInput";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

export default function SignUpScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await signUp({
        ...formData,
        role: role || UserRole.PATIENT,
      });

      if (success) {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case UserRole.PATIENT:
        return "Patient Account";
      case UserRole.HEALTH_PERSONNEL:
        return "Healthcare Professional Account";
      case UserRole.PHARMACY:
        return "Pharmacy Account";
      default:
        return "Create Account";
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case UserRole.PATIENT:
        return "🏥";
      case UserRole.HEALTH_PERSONNEL:
        return "👨‍⚕️";
      case UserRole.PHARMACY:
        return "💊";
      default:
        return "📋";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.roleHeader}>
              <ThemedText style={styles.roleIcon}>{getRoleIcon()}</ThemedText>
              <ThemedText type="title" style={styles.title}>
                {getRoleTitle()}
              </ThemedText>
            </View>
            <ThemedText type="secondary" style={styles.subtitle}>
              Create your Chiron account to get started
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <ChironInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChangeText={(value) =>
                    handleInputChange("firstName", value)
                  }
                  required
                />
              </View>
              <View style={styles.nameField}>
                <ChironInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange("lastName", value)}
                  required
                />
              </View>
            </View>

            <ChironInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              required
            />

            <ChironInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
              keyboardType="phone-pad"
              required
            />

            <ChironInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
              required
            />

            <ChironInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
              secureTextEntry
              required
            />

            <ChironButton
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              size="large"
              style={styles.signUpButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText type="secondary">Already have an account? </ThemedText>
            <ThemedText
              type="link"
              onPress={() => router.push("/(auth)/signin")}
            >
              Sign in here
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  roleHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    marginBottom: 32,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameField: {
    flex: 1,
    marginHorizontal: 4,
  },
  signUpButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
});
