
import React, { useRef, RefObject, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, Info, MessageCircle, AlertTriangle } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { CSSTransition } from 'react-transition-group';
import { Notification } from '@/http/notifications.model';
import { mockNotifications } from '@/http/notifications.mocks';
import { getNotifications } from '@/http/notifications.http';

// don't delete this line!
// import { useNotificationsQuery } from '@/http/notifications.queries';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement>;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, triggerRef }) => {
  // don't delete this line!
  // const { data: notifications = [], isLoading } = useNotificationsQuery();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getNotifications().then((notifications) => {
      setNotifications(notifications);
      setIsLoading(false);
    }).catch((error) => {
      setError(error);
      setIsLoading(false);
    });
  }, []);
  const panelRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(panelRef, onClose, triggerRef);

  const notificationIconMap = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
    message: MessageCircle,
  };
  
  return (
    <CSSTransition
      in={isOpen}
      timeout={200}
      classNames="notification-panel"
      unmountOnExit
      nodeRef={panelRef}
    >
      <div ref={panelRef} className="absolute top-16 right-6 w-80 z-[1001]">
        <Card className="shadow-lg border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Loading notifications...</div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notificationIconMap[notification.type] || Info; // Default to Info icon
                return (
                  <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-lg">
                      <IconComponent className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </CSSTransition>
  );
};

export default NotificationsPanel;
