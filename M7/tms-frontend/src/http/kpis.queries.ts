import { useQuery } from "@tanstack/react-query";
import { getKPIs, getKPIWidgets } from "./kpis.http";

export const useKPIsQuery = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: () => getKPIs(),
  });
};

export const useKPIWidgetsQuery = () => {
  return useQuery({
    queryKey: ['kpi-widgets'],
    queryFn: () => getKPIWidgets(),
  });
};