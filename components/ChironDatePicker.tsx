import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ChironDatePickerProps {
  label: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  required?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const ChironDatePicker: React.FC<ChironDatePickerProps> = ({
  label,
  value,
  onDateChange,
  placeholder = "Select date",
  required = false,
  maximumDate,
  minimumDate,
}) => {
  const [show, setShow] = useState(false);

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "tabIconDefault");

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {label}
        {required && <Text style={{ color: "#E53E3E" }}> *</Text>}
      </ThemedText>

      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            backgroundColor,
            borderColor: value ? primaryColor : borderColor,
          },
        ]}
        onPress={() => setShow(true)}
      >
        <Text
          style={[
            styles.dateText,
            {
              color: value ? textColor : placeholderColor,
            },
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={primaryColor} />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
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
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
});
