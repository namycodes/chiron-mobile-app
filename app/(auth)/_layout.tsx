import { AuthStore } from "@/store/AuthStore";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { token, role } = AuthStore();

  if (token && role != null || role != undefined) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="role-selection" options={{ headerShown: false }} />
    </Stack>
  );
}
