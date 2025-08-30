import {
  DrugStore,
  DrugStoreViewModel,
  HealthPersonnelDetailsResponse,
  HealthPersonnelResponse,
} from "@/types";
import { ApiRequest } from "./api";

export const HealthService = {
  getPersonnel: () => ApiRequest<HealthPersonnelResponse>("/health/personnel"),
  getPersonnelById: (id: string) =>
    ApiRequest<HealthPersonnelDetailsResponse>(`/health/personnel/${id}`),
  getDrugStores: () => ApiRequest<DrugStore>("/health/stores"),
  getDrugStoreById: (id: string) =>
    ApiRequest<DrugStoreViewModel>(`/health/stores/${id}`),
};
