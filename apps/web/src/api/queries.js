import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDashboard,
  getCandidates,
  getCandidate,
  getApplications,
  getApplication,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  createApplication,
  updateApplication,
  deleteApplication,
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

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCandidate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateCandidate(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateCandidate(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["candidate", id], updated);
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}

export function useDeleteCandidate(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCandidate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["candidate"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateApplication(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateApplication(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["application", id], updated);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["candidate"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteApplication(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["candidate"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
