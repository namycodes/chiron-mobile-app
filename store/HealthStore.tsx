import { HealthService } from "@/services/health.service";
import {
  Drug,
  DrugStore,
  DrugStoreViewModel,
  HealthPersonnel,
  HealthPersonnelViewModel,
} from "@/types";
import { create } from "zustand";

interface HealthState {
  personnel: HealthPersonnel[];
  drugStores: DrugStore[];
  loadingPersonnel: boolean;
  loadingDrugStores: boolean;
  errorPersonnel: string | null;
  errorDrugStores: string | null;
  personnelDetails: HealthPersonnelViewModel | null;
  loadingPersonnelDetails: boolean;
  errorPersonnelDetails: string | null;
  drugStoreDetails: DrugStoreViewModel | null;
  loadingDrugStoreDetails: boolean;
  errorDrugStoreDetails: string | null;
  drugs: Drug[];
  loadingDrugs: boolean;
  errorDrugs: string | null;
  drugDetails: Drug | null;
  loadingDrugDetails: boolean;
  errorDrugDetails: string | null;
  getHealthPersonnel: () => Promise<void>;
  getHealthDrugStores: () => Promise<void>;
  getHealthPersonnelById: (id: string) => Promise<void>;
  getDrugStoreById: (id: string) => Promise<void>;
  getDrugsByStoreId: (storeId: string) => Promise<void>;
  getDrugById: (drugId: string) => Promise<void>;
}

export const HealthStore = create<HealthState>((set, get) => ({
  loadingPersonnel: false,
  loadingDrugStores: false,
  errorDrugStores: null,
  errorPersonnel: null,
  errorPersonnelDetails: null,
  loadingPersonnelDetails: false,
  personnel: [],
  drugStores: [],
  personnelDetails: null,
  drugStoreDetails: null,
  loadingDrugStoreDetails: false,
  errorDrugStoreDetails: null,
  drugs: [],
  loadingDrugs: false,
  errorDrugs: null,
  drugDetails: null,
  loadingDrugDetails: false,
  errorDrugDetails: null,

  getHealthPersonnel: async () => {
    set({ loadingPersonnel: true, errorPersonnel: null });
    try {
      const { data } = await HealthService.getPersonnel();
      console.log("Health personnel data: ", data);
      set({
        loadingPersonnel: false,
        errorPersonnel: null,
        personnel: data.personnel,
      });
    } catch (error) {
      set({
        loadingPersonnel: false,
        errorPersonnel: "Failed to fetch health personnel",
      });
    }
  },
  getHealthDrugStores: async () => {
    set({ loadingDrugStores: true, errorDrugStores: null });
    try {
      const { data } = await HealthService.getDrugStores();
      set({
        loadingDrugStores: false,
        errorDrugStores: null,
        drugStores: data.stores,
      });
    } catch (error) {
      set({
        loadingDrugStores: false,
        errorDrugStores: "Failed to fetch drug stores",
      });
    }
  },
  getHealthPersonnelById: async (id: string) => {
    set({ loadingPersonnelDetails: true, errorPersonnelDetails: null });
    try {
      const { data } = await HealthService.getPersonnelById(id);
      set({
        loadingPersonnelDetails: false,
        errorPersonnelDetails: null,
        personnelDetails: data.personnel,
      });
    } catch (error) {
      console.error("Error fetching personnel details:", error);
      set({
        loadingPersonnelDetails: false,
        errorPersonnelDetails: "Failed to fetch health personnel details",
      });
    }
  },
  getDrugStoreById: async (id: string) => {
    set({ loadingDrugStoreDetails: true, errorDrugStoreDetails: null });
    try {
      const { data } = await HealthService.getDrugStoreById(id);
      set({
        loadingDrugStoreDetails: false,
        errorDrugStoreDetails: null,
        drugStoreDetails: data.store,
      });
    } catch (error) {
      console.error("Error fetching drug store details:", error);
      set({
        loadingDrugStoreDetails: false,
        errorDrugStoreDetails: "Failed to fetch drug store details",
      });
    }
  },
  getDrugsByStoreId: async (storeId: string) => {
    set({ loadingDrugs: true, errorDrugs: null });
    try {
      const { data } = await HealthService.getDrugsByStoreId(storeId);
      set({
        loadingDrugs: false,
        errorDrugs: null,
        drugs: data.drugs || [],
      });
      console.log("Drugs: ", get().drugs)
    } catch (error) {
      console.error("Error fetching drugs:", error);
      set({
        loadingDrugs: false,
        errorDrugs: "Failed to fetch drugs",
      });
    }
  },
  getDrugById: async (drugId: string) => {
    set({ loadingDrugDetails: true, errorDrugDetails: null });
    try {
      const { data } = await HealthService.getDrugById(drugId);
      set({
        loadingDrugDetails: false,
        errorDrugDetails: null,
        drugDetails: data.drug,
      });
    } catch (error) {
      console.error("Error fetching drug details:", error);
      set({
        loadingDrugDetails: false,
        errorDrugDetails: "Failed to fetch drug details",
      });
    }
  },
}));
