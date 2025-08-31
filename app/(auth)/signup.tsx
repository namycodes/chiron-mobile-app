import { ChironButton } from "@/components/ChironButton";
import { ChironDatePicker } from "@/components/ChironDatePicker";
import { ChironInput } from "@/components/ChironInput";
import { ChironPicker } from "@/components/ChironPicker";
import WordLogo from "@/components/LogoWord";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/hooks/useAuthStore";
import { UserRole } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { preselectedRole } = useLocalSearchParams<{
    preselectedRole?: UserRole;
  }>();
  const { register, loading, roles, fetchRoles, loadingRoles } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    // Optional fields based on role
    nhimaNumber: "",
    experience: "",
    specialty: "",
    name: "", // Business name for drug store
    address: "",
    dateOfBirth: null as Date | null,
    hospitalName: "",
    hospitalType: "",
    rate: "",
  });

  // Get selected role from roles array
  const selectedRole = roles.find((r) => r.id === formData.roleId);
  const selectedRoleType = selectedRole?.name as UserRole;

  // Specialty options for health personnel
  const specialtyOptions = [
    { label: "General Practitioner", value: "general_practitioner" },
    { label: "Cardiologist", value: "cardiologist" },
    { label: "Dermatologist", value: "dermatologist" },
    { label: "Neurologist", value: "neurologist" },
    { label: "Pediatrician", value: "pediatrician" },
    { label: "Psychiatrist", value: "psychiatrist" },
    { label: "Orthopedic", value: "orthopedic" },
    { label: "Gynecologist", value: "gynecologist" },
    { label: "Dentist", value: "dentist" },
    { label: "Optometrist", value: "optometrist" },
    { label: "Nurse", value: "nurse" },
    { label: "Physiotherapist", value: "physiotherapist" },
  ];

  // Hospital type options
  const hospitalTypeOptions = [
    { label: "Public Hospital", value: "public" },
    { label: "Private Hospital", value: "private" },
    { label: "Clinic", value: "clinic" },
    { label: "Health Center", value: "health_center" },
    { label: "Specialist Center", value: "specialist_center" },
  ];

  useEffect(() => {
    if (roles.length === 0 && !loadingRoles) {
      fetchRoles();
    }
  }, [roles, loadingRoles, fetchRoles]);

  // Preselect role if passed from role selection screen
  useEffect(() => {
    if (roles.length > 0 && preselectedRole && !formData.roleId) {
      const roleToSelect = roles.find((r) => r.name === preselectedRole);
      if (roleToSelect) {
        setFormData((prev) => ({ ...prev, roleId: roleToSelect.id }));
      }
    }
  }, [roles, preselectedRole, formData.roleId]);

  const handleInputChange = (field: string, value: string | Date | null) => {
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
      roleId,
    } = formData;

    // Basic required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !roleId
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    // Role-specific validation
    if (selectedRoleType === UserRole.HEALTH_PERSONNEL) {
      if (
        !formData.nhimaNumber ||
        !formData.specialty ||
        !formData.experience ||
        !formData.hospitalName ||
        !formData.hospitalType
      ) {
        Alert.alert(
          "Error",
          "Please fill in all healthcare professional fields"
        );
        return false;
      }
      const exp = parseInt(formData.experience);
      if (isNaN(exp) || exp < 0) {
        Alert.alert("Error", "Please enter a valid experience in years");
        return false;
      }
      if (
        formData.rate &&
        (isNaN(parseFloat(formData.rate)) || parseFloat(formData.rate) < 0)
      ) {
        Alert.alert("Error", "Please enter a valid consultation rate");
        return false;
      }
    }

    if (selectedRoleType === UserRole.DRUG_STORE) {
      if (!formData.nhimaNumber || !formData.name || !formData.address) {
        Alert.alert("Error", "Please fill in all pharmacy fields");
        return false;
      }
    }

    // Common validations
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

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        roleId: formData.roleId,
        ...(formData.nhimaNumber && { nhimaNumber: formData.nhimaNumber }),
        ...(formData.experience && {
          experience: parseInt(formData.experience),
        }),
        ...(formData.specialty && { specialty: formData.specialty }),
        ...(formData.name && { name: formData.name }),
        ...(formData.address && { address: formData.address }),
        ...(formData.dateOfBirth && {
          dateOfBirth: formData.dateOfBirth.toISOString(),
        }),
        ...(formData.hospitalName && { hospitalName: formData.hospitalName }),
        ...(formData.hospitalType && { hospitalType: formData.hospitalType }),
        ...(formData.rate && { rate: parseFloat(formData.rate) }),
      };

      const success = await register(registrationData);

      if (success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
        ]);
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const getRoleTitle = () => {
    switch (selectedRoleType) {
      case UserRole.USER:
        return "Patient Account";
      case UserRole.HEALTH_PERSONNEL:
        return "Healthcare Professional Account";
      case UserRole.DRUG_STORE:
        return "Pharmacy Account";
      default:
        return "Create Account";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <ThemedView style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <WordLogo size="large" style={styles.logo} />
              <View style={styles.roleHeader}>
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
              {selectedRoleType === UserRole.HEALTH_PERSONNEL ||
              selectedRoleType === UserRole.USER ? (
                <View style={styles.nameRow}>
                  <View style={styles.nameField}>
                    <ChironInput
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChangeText={(value) =>
                        handleInputChange("firstName", value)
                      }
                      leftIcon="person-outline"
                      required
                    />
                  </View>
                  <View style={styles.nameField}>
                    <ChironInput
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChangeText={(value) =>
                        handleInputChange("lastName", value)
                      }
                      leftIcon="person-outline"
                      required
                    />
                  </View>
                </View>
              ) : null}
              <ChironInput
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                leftIcon="mail-outline"
                required
              />

              <ChironInput
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChangeText={(value) =>
                  handleInputChange("phoneNumber", value)
                }
                keyboardType="phone-pad"
                leftIcon="call-outline"
                required
              />

              {/* Role Selection */}
              <ChironPicker
                label="Account Type"
                value={formData.roleId}
                onValueChange={(value) => handleInputChange("roleId", value)}
                options={roles.map((role) => ({
                  label:
                    role.name === UserRole.USER
                      ? "Patient"
                      : role.name === UserRole.HEALTH_PERSONNEL
                      ? "Healthcare Professional"
                      : role.name === UserRole.DRUG_STORE
                      ? "Pharmacy"
                      : role.name,
                  value: role.id,
                }))}
                placeholder="Select account type"
                required
              />

              {/* Date of Birth - Common for all roles */}
              <ChironDatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onDateChange={(date) => handleInputChange("dateOfBirth", date)}
                placeholder="Select your date of birth"
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />

              {/* Role-specific fields */}
              {selectedRoleType === UserRole.HEALTH_PERSONNEL && (
                <>
                  <ChironInput
                    label="NHIMA Number"
                    placeholder="Enter your NHIMA number"
                    value={formData.nhimaNumber}
                    onChangeText={(value) =>
                      handleInputChange("nhimaNumber", value)
                    }
                    leftIcon="card-outline"
                    required
                  />

                  <ChironPicker
                    label="Specialty"
                    value={formData.specialty}
                    onValueChange={(value) =>
                      handleInputChange("specialty", value)
                    }
                    options={specialtyOptions}
                    placeholder="Select your specialty"
                    required
                  />

                  <ChironInput
                    label="Years of Experience"
                    placeholder="Enter years of experience"
                    value={formData.experience}
                    onChangeText={(value) =>
                      handleInputChange("experience", value)
                    }
                    keyboardType="numeric"
                    leftIcon="time-outline"
                    required
                  />

                  <ChironInput
                    label="Hospital Name"
                    placeholder="Enter hospital/clinic name"
                    value={formData.hospitalName}
                    onChangeText={(value) =>
                      handleInputChange("hospitalName", value)
                    }
                    leftIcon="business-outline"
                    required
                  />

                  <ChironPicker
                    label="Hospital Type"
                    value={formData.hospitalType}
                    onValueChange={(value) =>
                      handleInputChange("hospitalType", value)
                    }
                    options={hospitalTypeOptions}
                    placeholder="Select hospital type"
                    required
                  />

                  <ChironInput
                    label="Consultation Rate (Optional)"
                    placeholder="Enter consultation rate"
                    value={formData.rate}
                    onChangeText={(value) => handleInputChange("rate", value)}
                    keyboardType="numeric"
                    leftIcon="cash-outline"
                  />
                </>
              )}

              {selectedRoleType === UserRole.DRUG_STORE && (
                <>
                  <ChironInput
                    label="NHIMA Number"
                    placeholder="Enter your NHIMA number"
                    value={formData.nhimaNumber}
                    onChangeText={(value) =>
                      handleInputChange("nhimaNumber", value)
                    }
                    leftIcon="card-outline"
                    required
                  />

                  <ChironInput
                    label="Pharmacy Name"
                    placeholder="Enter pharmacy name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    leftIcon="storefront-outline"
                    required
                  />

                  <ChironInput
                    label="Address"
                    placeholder="Enter pharmacy address"
                    value={formData.address}
                    onChangeText={(value) =>
                      handleInputChange("address", value)
                    }
                    leftIcon="location-outline"
                    multiline
                    numberOfLines={3}
                    required
                  />
                </>
              )}

              {selectedRoleType === UserRole.USER && (
                <>
                  <ChironInput
                    label="NHIMA Number (Optional)"
                    placeholder="Enter your NHIMA number"
                    value={formData.nhimaNumber}
                    onChangeText={(value) =>
                      handleInputChange("nhimaNumber", value)
                    }
                    leftIcon="card-outline"
                  />
                </>
              )}

              <ChironInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                leftIcon="lock-closed-outline"
                showPasswordToggle
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
                leftIcon="lock-closed-outline"
                showPasswordToggle
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
              <ThemedText type="secondary">
                Already have an account?{" "}
              </ThemedText>
              <ThemedText
                type="link"
                onPress={() => router.push("/(auth)/signin")}
              >
                Sign in here
              </ThemedText>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {},
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
