import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Drug } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface PrescriptionModalProps {
  drug: Drug | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (prescriptionCode?: string, prescriptionDocument?: string) => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  drug,
  visible,
  onClose,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [prescriptionCode, setPrescriptionCode] = useState("");
  const [prescriptionDocument, setPrescriptionDocument] = useState<
    string | null
  >(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "code" | "document" | null
  >(null);

  if (!drug) return null;

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionDocument(asset.uri);
        setDocumentName(asset.name);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to upload prescription images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionDocument(asset.uri);
        setDocumentName("prescription_image.jpg");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleCameraPicker = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow camera access to take prescription photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setPrescriptionDocument(asset.uri);
        setDocumentName("prescription_photo.jpg");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Upload Prescription",
      "Choose how you want to upload your prescription",
      [
        { text: "Take Photo", onPress: handleCameraPicker },
        { text: "Choose from Gallery", onPress: handleImagePicker },
        { text: "Choose Document", onPress: handleDocumentPicker },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleSubmit = async () => {
    if (selectedMethod === "code" && !prescriptionCode.trim()) {
      Alert.alert("Error", "Please enter a prescription code.");
      return;
    }

    if (selectedMethod === "document" && !prescriptionDocument) {
      Alert.alert("Error", "Please upload a prescription document.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(
        selectedMethod === "code" ? prescriptionCode : undefined,
        selectedMethod === "document"
          ? prescriptionDocument || undefined
          : undefined
      );

      // Reset form
      setPrescriptionCode("");
      setPrescriptionDocument(null);
      setDocumentName(null);
      setSelectedMethod(null);
    } catch (error) {
      Alert.alert("Error", "Failed to submit prescription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPrescriptionCode("");
    setPrescriptionDocument(null);
    setDocumentName(null);
    setSelectedMethod(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Prescription Required
          </ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Drug Info */}
          <View
            style={[styles.drugInfo, { backgroundColor: colors.background }]}
          >
            <Image
              source={{
                uri: drug.imageUrl || "https://via.placeholder.com/60",
              }}
              style={styles.drugImage}
            />
            <View style={styles.drugDetails}>
              <ThemedText type="subtitle" style={styles.drugName}>
                {drug.name}
              </ThemedText>
              <Text
                style={[
                  styles.drugManufacturer,
                  { color: colors.tabIconDefault },
                ]}
              >
                {drug.manufacturer || "Unknown manufacturer"}
              </Text>
            </View>
          </View>

          {/* Warning Notice */}
          <View style={[styles.warningSection, { backgroundColor: "#FEF2F2" }]}>
            <Ionicons name="warning" size={24} color="#EF4444" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Prescription Required</Text>
              <Text style={styles.warningText}>
                This medication requires a valid prescription. Please provide
                either a prescription code or upload a prescription document.
              </Text>
            </View>
          </View>

          {/* Method Selection */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Choose Verification Method
            </ThemedText>

            {/* Prescription Code Option */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                {
                  borderColor:
                    selectedMethod === "code"
                      ? colors.tint
                      : colors.tabIconDefault,
                },
                selectedMethod === "code" && {
                  backgroundColor: `${colors.tint}10`,
                },
              ]}
              onPress={() => setSelectedMethod("code")}
            >
              <View style={styles.methodIcon}>
                <Ionicons
                  name="key-outline"
                  size={24}
                  color={
                    selectedMethod === "code"
                      ? colors.tint
                      : colors.tabIconDefault
                  }
                />
              </View>
              <View style={styles.methodContent}>
                <ThemedText style={styles.methodTitle}>
                  Prescription Code
                </ThemedText>
                <Text
                  style={[
                    styles.methodDescription,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Enter the code provided by your doctor
                </Text>
              </View>
              <Ionicons
                name={
                  selectedMethod === "code"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  selectedMethod === "code"
                    ? colors.tint
                    : colors.tabIconDefault
                }
              />
            </TouchableOpacity>

            {/* Document Upload Option */}
            <TouchableOpacity
              style={[
                styles.methodOption,
                {
                  borderColor:
                    selectedMethod === "document"
                      ? colors.tint
                      : colors.tabIconDefault,
                },
                selectedMethod === "document" && {
                  backgroundColor: `${colors.tint}10`,
                },
              ]}
              onPress={() => setSelectedMethod("document")}
            >
              <View style={styles.methodIcon}>
                <Ionicons
                  name="document-outline"
                  size={24}
                  color={
                    selectedMethod === "document"
                      ? colors.tint
                      : colors.tabIconDefault
                  }
                />
              </View>
              <View style={styles.methodContent}>
                <ThemedText style={styles.methodTitle}>
                  Upload Document
                </ThemedText>
                <Text
                  style={[
                    styles.methodDescription,
                    { color: colors.tabIconDefault },
                  ]}
                >
                  Upload a photo or scan of your prescription
                </Text>
              </View>
              <Ionicons
                name={
                  selectedMethod === "document"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  selectedMethod === "document"
                    ? colors.tint
                    : colors.tabIconDefault
                }
              />
            </TouchableOpacity>
          </View>

          {/* Prescription Code Input */}
          {selectedMethod === "code" && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Enter Prescription Code
              </ThemedText>
              <TextInput
                style={[
                  styles.codeInput,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                placeholder="Enter prescription code..."
                placeholderTextColor={colors.tabIconDefault}
                value={prescriptionCode}
                onChangeText={setPrescriptionCode}
                autoCapitalize="characters"
              />
            </View>
          )}

          {/* Document Upload */}
          {selectedMethod === "document" && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Upload Prescription Document
              </ThemedText>

              {prescriptionDocument ? (
                <View
                  style={[
                    styles.uploadedDocument,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons name="document" size={40} color={colors.tint} />
                  <View style={styles.documentInfo}>
                    <ThemedText style={styles.documentName}>
                      {documentName}
                    </ThemedText>
                    <Text
                      style={[styles.documentStatus, { color: colors.tint }]}
                    >
                      Document uploaded successfully
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setPrescriptionDocument(null);
                      setDocumentName(null);
                    }}
                    style={styles.removeDocument}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadButton, { borderColor: colors.tint }]}
                  onPress={showImagePickerOptions}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={32}
                    color={colors.tint}
                  />
                  <ThemedText
                    style={[styles.uploadText, { color: colors.tint }]}
                  >
                    Upload Prescription
                  </ThemedText>
                  <Text
                    style={[
                      styles.uploadSubtext,
                      { color: colors.tabIconDefault },
                    ]}
                  >
                    Take photo, choose from gallery, or select document
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View
          style={[styles.actionButtons, { backgroundColor: colors.background }]}
        >
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { borderColor: colors.tabIconDefault },
            ]}
            onPress={handleClose}
          >
            <Text
              style={[
                styles.cancelButtonText,
                { color: colors.tabIconDefault },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  selectedMethod && !isSubmitting
                    ? colors.tint
                    : colors.tabIconDefault,
              },
            ]}
            onPress={handleSubmit}
            disabled={!selectedMethod || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Adding..." : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  drugInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  drugImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  drugDetails: {
    flex: 1,
    marginLeft: 12,
  },
  drugName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  drugManufacturer: {
    fontSize: 14,
  },
  warningSection: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "monospace",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  uploadedDocument: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  documentStatus: {
    fontSize: 14,
  },
  removeDocument: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
