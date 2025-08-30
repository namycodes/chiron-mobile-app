import { HealthService } from "@/services/health.service";
import { DrugStore, HealthPersonnel, HealthPersonnelViewModel } from "@/types";
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
  getHealthPersonnel: () => Promise<void>;
  getHealthDrugStores: () => Promise<void>;
  getHealthPersonnelById: (id: string) => Promise<void>;
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
  getHealthDrugStores: async () => {},
  getHealthPersonnelById: async (id: string) => {
    set({ loadingPersonnelDetails: true, errorPersonnelDetails: null });
    try {
      const { data } = await HealthService.getPersonnelById(id);
      console.log("Health personnel details: ", data);
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
}));
