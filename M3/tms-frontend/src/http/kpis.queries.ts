import { useQuery } from "@tanstack/react-query";
import { delay } from "./mock.http";
import { getKPIs } from "./kpis.http";
import { mockKPIWidgets } from "./kpis.mocks";

export const useKPIsQuery = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: () => getKPIs(),
  });
};

export const useKPIWidgetsQuery = () => {
  return useQuery({
    queryKey: ['kpi-widgets'],
    queryFn: async () => {
      await delay(300);
      return mockKPIWidgets;
    },
  });
};