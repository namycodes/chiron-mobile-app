import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ChironInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
}

export function ChironInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showPasswordToggle = false,
}: ChironInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const primaryColor = useThemeColor({}, "primary");
  const errorColor = useThemeColor({}, "error");
  const borderColor = useThemeColor({}, "border");
  const backgroundColor = useThemeColor({}, "background");
  const surfaceColor = useThemeColor({}, "surface");

  const getBorderColor = () => {
    if (error) return errorColor;
    if (isFocused) return primaryColor;
    return borderColor;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <View style={styles.iconContainer}>
        <Ionicons
          name={leftIcon}
          size={20}
          color={isFocused ? primaryColor : textSecondary}
        />
      </View>
    );
  };

  const renderRightIcon = () => {
    // Show password toggle if it's a password field and showPasswordToggle is true
    if (secureTextEntry && showPasswordToggle) {
      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={textSecondary}
          />
        </TouchableOpacity>
      );
    }

    // Show custom right icon
    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.iconContainer}
          activeOpacity={0.7}
          disabled={!onRightIconPress}
        >
          <Ionicons
            name={rightIcon}
            size={20}
            color={isFocused ? primaryColor : textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            {label}
            {required && <Text style={{ color: errorColor }}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: surfaceColor,
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {renderLeftIcon()}

        <TextInput
          style={[
            styles.input,
            { color: textColor },
            multiline && styles.multilineInput,
            disabled && styles.disabledInput,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || (secureTextEntry && showPasswordToggle)) &&
              styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          autoCapitalize="none"
        />

        {renderRightIcon()}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10, // Reduced from 12
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48, // Reduced from default
  },
  input: {
    fontSize: 16,
    flex: 1,
    minHeight: 20, // Reduced from 24
    paddingVertical: 0, // Remove default padding
  },
  inputWithLeftIcon: {
    marginLeft: 12,
  },
  inputWithRightIcon: {
    marginRight: 12,
  },
  iconContainer: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  multilineInput: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  disabledInput: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
