import { ChironButton } from "@/components/ChironButton";
import { ChironInput } from "@/components/ChironInput";
import WordLogo from "@/components/LogoWord";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AuthStore } from "@/store/AuthStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = AuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // login now returns a boolean indicating success
    const success = await login(email, password);
    if (!success) {
      const store = AuthStore();
      const errMsg = store.message || store.error || "Invalid credentials";
      Alert.alert("Error", errMsg);
      return;
    }
    // successful login -> navigate
    router.replace("/(tabs)");
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <WordLogo showText={false} size="large" style={styles.logo} />
              <ThemedText type="title" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText type="secondary" style={styles.subtitle}>
                Sign in to your Chiron account
              </ThemedText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <ChironInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="mail-outline"
                required
              />

              <ChironInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon="lock-closed-outline"
                showPasswordToggle
                required
              />

              <ChironButton
                title="Sign In"
                onPress={handleSignIn}
                loading={loading}
                style={styles.signInButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText type="secondary">Don't have an account? </ThemedText>
              <ThemedText
                type="link"
                onPress={() => router.push("/(auth)/signup")}
              >
                Sign up here
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    minHeight: "100%",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    // marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  signInButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
});
