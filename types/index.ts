// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  PATIENT = 'patient',
  HEALTH_PERSONNEL = 'health_personnel',
  PHARMACY = 'pharmacy'
}

// Patient Interface
export interface Patient extends User {
  role: UserRole.PATIENT;
  medicalHistory?: string[];
  emergencyContact?: EmergencyContact;
  bloodType?: string;
  allergies?: string[];
  currentMedications?: string[];
}

// Health Personnel Interface
export interface HealthPersonnel extends User {
  role: UserRole.HEALTH_PERSONNEL;
  specialty: Specialty;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  serviceRates: ServiceRate[];
  documents: Document[];
  isPrivateAffiliated: boolean;
  institutionName?: string;
  availability: Availability[];
  location: Location;
  rating: number;
  reviewCount: number;
}

// Pharmacy Interface
export interface Pharmacy extends User {
  role: UserRole.PHARMACY;
  pharmacyName: string;
  licenseNumber: string;
  location: Location;
  operatingHours: OperatingHours;
  deliveryOptions: DeliveryOption[];
  rating: number;
  reviewCount: number;
}

// Supporting Types
export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export enum Specialty {
  GENERAL_PRACTITIONER = 'general_practitioner',
  CARDIOLOGIST = 'cardiologist',
  DERMATOLOGIST = 'dermatologist',
  NEUROLOGIST = 'neurologist',
  PEDIATRICIAN = 'pediatrician',
  PSYCHIATRIST = 'psychiatrist',
  ORTHOPEDIC = 'orthopedic',
  GYNECOLOGIST = 'gynecologist',
  DENTIST = 'dentist',
  OPTOMETRIST = 'optometrist',
  NURSE = 'nurse',
  PHYSIOTHERAPIST = 'physiotherapist'
}

export interface ServiceRate {
  serviceType: string;
  price: number;
  duration: number; // in minutes
  description: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  fileName: string;
  url: string;
  uploadedAt: Date;
  isVerified: boolean;
}

export enum DocumentType {
  MEDICAL_LICENSE = 'medical_license',
  CERTIFICATION = 'certification',
  ID_DOCUMENT = 'id_document',
  INSURANCE = 'insurance'
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface DeliveryOption {
  type: DeliveryType;
  fee: number;
  estimatedTime: string; // "30-45 minutes"
  minOrderAmount?: number;
}

export enum DeliveryType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  EXPRESS = 'express'
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  healthPersonnelId: string;
  serviceType: string;
  scheduledDate: Date;
  duration: number;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  location?: Location;
  isVirtual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  description: string;
  manufacturer: string;
  category: MedicationCategory;
  images: string[];
  prescriptionRequired: boolean;
  sideEffects?: string[];
  dosageInstructions?: string;
  contraindications?: string[];
}

export enum MedicationCategory {
  PAIN_RELIEF = 'pain_relief',
  ANTIBIOTICS = 'antibiotics',
  HEART_MEDICATION = 'heart_medication',
  DIABETES = 'diabetes',
  MENTAL_HEALTH = 'mental_health',
  VITAMINS = 'vitamins',
  FIRST_AID = 'first_aid',
  SKINCARE = 'skincare'
}

export interface PharmacyInventory {
  medicationId: string;
  pharmacyId: string;
  price: number;
  stock: number;
  expiryDate: Date;
  manufacturer: string;
  batchNumber?: string;
}

// Order Types
export interface Order {
  id: string;
  patientId: string;
  pharmacyId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryOption: DeliveryOption;
  deliveryAddress?: Location;
  prescriptionImages?: string[];
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface OrderItem {
  medicationId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Review Types
export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  revieweeType: 'health_personnel' | 'pharmacy';
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  appointmentId?: string;
  orderId?: string;
}

// Search/Filter Types
export interface SearchFilters {
  specialty?: Specialty;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: {
    date: Date;
    timeSlot?: string;
  };
  rating?: number;
  isVerified?: boolean;
  acceptsInsurance?: boolean;
}

// Chat Types
export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  readBy: string[];
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  PRESCRIPTION = 'prescription',
  APPOINTMENT_REMINDER = 'appointment_reminder'
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    experience: number;
    hospital: string;
    distance: string;
    consultationFee: number;
    availability: "available" | "busy" | "offline";
    image: string;
    tags: string[];
    isVerified: boolean;
    gender: "male" | "female" | "other";
}

type RequestMethod = "GET" | "POST" | "UPDATE" | "DELETE" | "PATCH" | "PUT"

export interface RequestOptions {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
}

export interface LoginResponse {
  data: {
    token: string
  },
  message: string, 
  statusCode: number
}