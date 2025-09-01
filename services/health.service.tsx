import {
  DrugDetailsResponse,
  DrugResponse,
  DrugStoreDetailsResponse,
  DrugStoresResponse,
  HealthPersonnelDetailsResponse,
  HealthPersonnelResponse,
} from "@/types";
import { ApiRequest } from "./api";

export const HealthService = {
  getPersonnel: () => ApiRequest<HealthPersonnelResponse>("/health/personnel"),
  getPersonnelById: (id: string) =>
    ApiRequest<HealthPersonnelDetailsResponse>(`/health/personnel/${id}`),
  getDrugStores: () => ApiRequest<DrugStoresResponse>("/health/stores"),
  getDrugStoreById: (id: string) =>
    ApiRequest<DrugStoreDetailsResponse>(`/health/stores/${id}`),
  getDrugsByStoreId: (storeId: string) =>
    ApiRequest<DrugResponse>(`/health/stores/${storeId}/drugs`),
  getDrugById: (drugId: string) =>
    ApiRequest<DrugDetailsResponse>(`/drugs/${drugId}`),
};
