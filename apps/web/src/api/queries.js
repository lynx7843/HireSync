import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  getCandidates,
  getCandidate,
  getApplications,
  getApplication,
} from "./client";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });
}

export function useCandidates(filters) {
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => getCandidates(filters),
  });
}

export function useCandidate(id) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: () => getCandidate(id),
    enabled: Boolean(id),
  });
}

export function useApplications(filters) {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => getApplications(filters),
  });
}

export function useApplication(id) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
    enabled: Boolean(id),
  });
}
