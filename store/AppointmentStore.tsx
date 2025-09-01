import { AppointmentService } from "@/services/appointment.service";
import { Appointment, AppointmentSession, CreateAppointment } from "@/types";
import { create } from "zustand";

interface AppointmentState {
  appointments: Appointment[];
  getUserAppointments: () => Promise<void>;
  scheduleAppointment: (appointment: CreateAppointment) => Promise<void>;
  appointmentCreating: boolean;
  appointmentsLoading: boolean;
  appointmentCreatingError: string | null;
  appointmentsFetchingError: string | null;
  appointment: Appointment | {};
  appointmentSessions: AppointmentSession[];
  appointmentSessionsLoading: boolean;
  appointmentSessionsError: string | null;
  getAppointmentSessions: (
    personnelId: string,
    sessionDate: Date
  ) => Promise<void>;
}

export const AppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  appointmentCreating: false,
  appointmentsLoading: false,
  appointmentCreatingError: null,
  appointmentsFetchingError: null,
  appointmentSessions: [],
  appointmentSessionsLoading: false,
  appointmentSessionsError: null,
  appointment: {},
  getUserAppointments: async () => {
    try {
      set({
        appointmentsLoading: true,
        appointmentsFetchingError: null,
      });
      const { data } = await AppointmentService.getUserAppointments();
      set({
        appointments: data.appointments,
        appointmentsLoading: false,
        appointmentsFetchingError: null,
      });
    } catch (error: any) {
      set({
        appointmentsLoading: false,
        appointmentsFetchingError:
          error.message || "Failed to fetch appointments",
      });
    }
  },
  scheduleAppointment: async (appointment: CreateAppointment) => {
    set({ appointment: {}, appointmentCreating: true });
    try {
      set({
        appointmentCreating: false,
        appointmentCreatingError: null,
      });
      const { data } = await AppointmentService.scheduleAppointment(
        appointment
      );
      set({ appointment: data.appointment, appointmentCreating: false });
    } catch (error: any) {
      set({
        appointmentCreating: false,
        appointmentCreatingError:
          error.message || "failed to schedule appointment",
      });
    }
  },
  getAppointmentSessions: async (personnelId: string, sessionDate: Date) => {
    try {
      set({
        appointmentSessions: [],
        appointmentSessionsError: null,
        appointmentSessionsLoading: true,
      });
      const { data } = await AppointmentService.getAppointmentSessions(
        personnelId,
        sessionDate
      );
      console.log("Session Dates: ", data);
      set({
        appointmentSessions: data.sessions,
        appointmentSessionsError: null,
        appointmentSessionsLoading: false,
      });
    } catch (error: any) {
      console.log("error: ", error);
      set({
        appointmentSessionsLoading: false,
        appointmentSessionsError:
          error.message || "failed to fetch appointment sessions",
      });
    }
  },
}));
