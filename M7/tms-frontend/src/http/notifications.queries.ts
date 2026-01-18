import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "./notifications.http";

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });
};
