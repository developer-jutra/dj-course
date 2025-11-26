
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUrgentItems } from '@/http/urgent.queries';

// Mock users for reassignment
const availableUsers = [
  { id: '1', name: 'Mike Johnson' },
  { id: '2', name: 'Sarah Lee' },
  { id: '3', name: 'David Chen' },
  { id: '4', name: 'Lisa Park' },
  { id: '5', name: 'Alex Rodriguez' },
  { id: '6', name: 'Emma Wilson' },
  { id: '7', name: 'Tom Anderson' },
];

interface TakeActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  urgentItem: {
    id: number;
    message: string;
    action: string;
    assignee: string;
  } | null;
}

const TakeActionForm: React.FC<TakeActionFormProps> = ({ isOpen, onClose, urgentItem }) => {
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Take Action</DialogTitle>
          <DialogDescription>
            Action details for urgent item
          </DialogDescription>
        </DialogHeader>
        
        {urgentItem && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Item:</Label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {urgentItem.message}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Required Action:</Label>
              <p className="text-sm font-medium">{urgentItem.action}</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Assigned To:</Label>
              <p className="text-sm font-medium">{urgentItem.assignee}</p>
            </div>
            
            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-yellow-600 text-2xl">⚠️</div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Feature Not Implemented</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    The action functionality for this urgent item has not been implemented yet. 
                    Please contact your system administrator for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ReassignFormProps {
  isOpen: boolean;
  onClose: () => void;
  urgentItem: {
    id: number;
    message: string;
    assignee: string;
  } | null;
  onReassign: (itemId: number, newAssignee: string) => void;
}

const ReassignForm: React.FC<ReassignFormProps> = ({ isOpen, onClose, urgentItem, onReassign }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleReassign = () => {
    if (urgentItem && selectedUser) {
      const selectedUserName = availableUsers.find(user => user.id === selectedUser)?.name || '';
      onReassign(urgentItem.id, selectedUserName);
      setSelectedUser('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedUser('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Urgent Item</DialogTitle>
          <DialogDescription>
            Select a user to reassign this urgent item to.
          </DialogDescription>
        </DialogHeader>
        
        {urgentItem && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Item:</Label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {urgentItem.message}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Currently Assigned To:</Label>
              <p className="text-sm font-medium">{urgentItem.assignee}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-select">Reassign To:</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers
                    .filter(user => user.name !== urgentItem.assignee)
                    .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleReassign} 
            disabled={!selectedUser}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Urgent = () => {
  const { data: urgentItems = [], isLoading } = useUrgentItems();
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [takeActionModalOpen, setTakeActionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    message: string;
    action: string;
    assignee: string;
  } | null>(null);
  const [items, setItems] = useState(urgentItems);

  // Update local state when data changes
  React.useEffect(() => {
    setItems(urgentItems);
  }, [urgentItems]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return '⏰';
      case 'maintenance': return '🔧';
      case 'payment': return '💳';
      case 'driver': return '👨‍💼';
      default: return '⚠️';
    }
  };

  const handleReassignClick = (item: any) => {
    setSelectedItem({
      id: item.id,
      message: item.message,
      action: item.action,
      assignee: item.assignee
    });
    setReassignModalOpen(true);
  };

  const handleTakeActionClick = (item: any) => {
    setSelectedItem({
      id: item.id,
      message: item.message,
      action: item.action,
      assignee: item.assignee
    });
    setTakeActionModalOpen(true);
  };

  const handleReassign = (itemId: number, newAssignee: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, assignee: newAssignee }
          : item
      )
    );
    
    // Here you would typically make an API call to update the assignment
    console.log(`Reassigned item ${itemId} to ${newAssignee}`);
    alert(`Successfully reassigned item to ${newAssignee}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading urgent items...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Urgent Items</h1>
        <p className="text-gray-600">Action items requiring immediate attention</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-900">{item.message}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Required Action</p>
                  <p className="text-sm font-medium">{item.action}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned to</p>
                  <p className="text-sm font-medium">{item.assignee}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleTakeActionClick(item)}
                >
                  Take Action
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReassignClick(item)}
                >
                  Reassign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No urgent items require attention at this time.</p>
          </CardContent>
        </Card>
      )}

      <ReassignForm
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        urgentItem={selectedItem}
        onReassign={handleReassign}
      />

      <TakeActionForm
        isOpen={takeActionModalOpen}
        onClose={() => setTakeActionModalOpen(false)}
        urgentItem={selectedItem}
      />
    </div>
  );
};

export default Urgent;
