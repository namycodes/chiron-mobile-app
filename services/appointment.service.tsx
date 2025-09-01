import {
  AppointmentResponse,
  AppointmentSessionsResponse,
  AppointmentsResponse,
  CreateAppointment,
} from "@/types";
import { ApiRequest } from "./api";

export const AppointmentService = {
  scheduleAppointment: (appointment: CreateAppointment) =>
    ApiRequest<AppointmentResponse>("/appointments", {
      method: "POST",
      body: appointment,
    }),
  getUserAppointments: () =>
    ApiRequest<AppointmentsResponse>("/appointments", {
      method: "GET",
    }),
  getAppointmentSessions: (personnelId: string, sessionDate: Date) => {
    return ApiRequest<AppointmentSessionsResponse>(
      `/appointments/sessions?personnelId=${personnelId}&sessionDate=${sessionDate.toISOString()}`,
      {
        method: "GET",
      }
    );
  },
};
