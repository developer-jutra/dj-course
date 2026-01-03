import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUrgentItems, getAvailableEmployees, reassignUrgentItemToEmployee } from './urgent.http';
import { AvailableEmployee, UrgentItem } from './urgent.model';

export const useUrgentItems = () => {
  return useQuery({
    queryKey: ['urgent-items'],
    queryFn: getUrgentItems,
  });
};

export const useAvailableEmployees = () => {
  return useQuery({
    queryKey: ['available-employees'],
    queryFn: getAvailableEmployees,
  });
};

interface ReassignMutationVariables {
  itemId: number;
  employeeId: string;
}

export const useReassignUrgentItemToEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ReassignMutationVariables>({
    mutationFn: ({ itemId, employeeId }) => reassignUrgentItemToEmployee(itemId, employeeId),
    onSuccess: (_, { itemId, employeeId }) => {
      const availableEmployees = queryClient.getQueryData<AvailableEmployee[]>(['available-employees']) || [];
      const employeeName = availableEmployees.find(emp => emp.id === employeeId)?.name || 'Unknown';

      queryClient.setQueryData<UrgentItem[]>(['urgent-items'], (oldData) => {
        if (!oldData) {
          return [];
        }
        return oldData.map((item) =>
          item.id === itemId ? { ...item, assignee: employeeName } : item
        );
      });
    },
  });
};
