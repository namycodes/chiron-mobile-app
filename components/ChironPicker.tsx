import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface PickerOption {
  label: string;
  value: string;
}

interface ChironPickerProps {
  label: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  required?: boolean;
}

export const ChironPicker: React.FC<ChironPickerProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select option",
  required = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "tabIconDefault");

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {label}
        {required && <Text style={{ color: "#E53E3E" }}> *</Text>}
      </ThemedText>

      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor,
            borderColor: value ? primaryColor : borderColor,
          },
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Text
          style={[
            styles.pickerText,
            {
              color: value ? textColor : placeholderColor,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color={primaryColor} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Select {label}</ThemedText>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor:
                        item.value === value
                          ? primaryColor + "20"
                          : "transparent",
                    },
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={20} color={primaryColor} />
                  )}
                </TouchableOpacity>
              )}
            />
          </ThemedView>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
