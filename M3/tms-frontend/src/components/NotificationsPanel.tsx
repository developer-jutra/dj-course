
import React, { useRef, RefObject } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNotificationsQuery } from '@/http/notifications.queries';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { CSSTransition } from 'react-transition-group';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement>;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, triggerRef }) => {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const panelRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(panelRef, onClose, triggerRef);
  
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
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-lg">{notification.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </CSSTransition>
  );
};

export default NotificationsPanel;
