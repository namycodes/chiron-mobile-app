import { ChironButton } from "@/components/ChironButton";
import { ChironInput } from "@/components/ChironInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AuthStore } from "@/store/AuthStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
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
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Welcome Back</ThemedText>
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
          <ThemedText type="link" onPress={() => router.push("/(auth)/signup")}>
            Sign up here
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
    justifyContent: "space-between",
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    flex: 1,
  },
  signInButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
});
