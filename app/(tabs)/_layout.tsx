import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserRole } from "@/types";
import { AntDesign, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { AuthStore } from "@/store/AuthStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {token, role} = AuthStore()
console.log("User role: ", role)
  if (!token) {
    return <Redirect href="/(auth)/signin" />;
  }

  // Define screen configurations for each role
  const getScreensConfig = () => {
    const commonScreens = [
      {
        name: "index" as const,
        options: {
          title: role === UserRole.USER ? "Home" : "Dashboard",
          tabBarIcon: ({ color }: { color: string }) => (
            <AntDesign size={28} name="home" color={color} />
          ),
        },
      },
    ];

    let roleScreens: any[] = [];

    switch (role) {
      case UserRole.USER:
        roleScreens = [
          {
            name: "doctors/index" as const,
            options: {
              title: "Doctors",
              tabBarIcon: ({ color }: { color: string }) => (
                <FontAwesome size={20} name="stethoscope" color={color} />
              ),
            },
          },
          {
            name: "wishlist" as const,
            options: {
              title: "WishList",
              tabBarIcon: ({ color }: { color: string }) => (
                <AntDesign size={20} name="hearto" color={color} />
              ),
            },
          },
          {
            name: "cart/index" as const,
            options: {
              title: "Cart",
              tabBarIcon: ({ color }: { color: string }) => (
                <SimpleLineIcons size={20} name="handbag" color={color} />
              ),
            },
          },
        ];
        break;

      case UserRole.HEALTH_PERSONNEL:
        roleScreens = [
          {
            name: "appointments" as const,
            options: {
              title: "Appointments",
              tabBarIcon: ({ color }: { color: string }) => (
                <FontAwesome size={20} name="calendar" color={color} />
              ),
            },
          },
          {
            name: "patients" as const,
            options: {
              title: "Patients",
              tabBarIcon: ({ color }: { color: string }) => (
                <FontAwesome size={20} name="users" color={color} />
              ),
            },
          },
        ];
        break;

      case UserRole.DRUG_STORE:
        roleScreens = [
          {
            name: "inventory" as const,
            options: {
              title: "Inventory",
              tabBarIcon: ({ color }: { color: string }) => (
                <FontAwesome size={28} name="list-ul" color={color} />
              ),
            },
          },
          {
            name: "orders" as const,
            options: {
              title: "Orders",
              tabBarIcon: ({ color }: { color: string }) => (
                <FontAwesome size={20} name="shopping-bag" color={color} />
              ),
            },
          },
        ];
        break;
    }

    const profileScreen = {
      name: "profile/index" as const,
      options: {
        title: "Profile",
        tabBarIcon: ({ color }: { color: string }) => (
          <FontAwesome size={20} name="user-o" color={color} />
        ),
      },
    };

    return [...commonScreens, ...roleScreens, profileScreen];
  };

  const hiddenScreens = [
    { name: "search/index" as const },
    { name: "pharmacy/index" as const },
    { name: "doctors/[id]" as const },
    { name: "appointments/index" as const },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {/* Render visible tabs based on user role */}
      {getScreensConfig().map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={screen.options}
        />
      ))}

      {/* Hidden screens */}
      {hiddenScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            href: null,
          }}
        />
      ))}
    </Tabs>
  );
}
