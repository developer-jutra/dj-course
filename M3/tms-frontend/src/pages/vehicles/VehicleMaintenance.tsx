import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle, MaintenanceRecord, MaintenanceTask } from '../../model/vehicles/vehicle.types';
import { 
  ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle, 
  Wrench, DollarSign, User, FileText, Plus, Filter,
  TrendingUp, AlertCircle, Settings, MapPin, List, Rows
} from 'lucide-react';
import { formatDateTime, formatDate } from '../../lib/date/dateUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { VehicleCombobox } from './VehicleCombobox';
import { Button } from '../../components/ui/button';
import Currency from '../../components/Currency';

interface VehicleMaintenanceProps {
  data: Vehicle | Vehicle[];
  onBack: () => void;
}

type TabId = 'overview' | 'overdue' | 'scheduled' | 'record';

export const VehicleMaintenance: React.FC<VehicleMaintenanceProps> = ({ data, onBack }) => {
  const isAllVehiclesMode = Array.isArray(data);
  const vehicle = isAllVehiclesMode ? undefined : data;
  const vehicles = isAllVehiclesMode ? data : [data];

  const [activeTab, setActiveTab] = useState<TabId>(isAllVehiclesMode ? 'overdue' : 'overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'brief'>('brief');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');

  const getStatusColor = (status: MaintenanceRecord['status'] | MaintenanceTask['status']) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getMaintenanceTypeIcon = (type: MaintenanceRecord['type'] | MaintenanceTask['type']) => {
    const icons = {
      'routine': <Settings className="w-4 h-4" />,
      'repair': <Wrench className="w-4 h-4" />,
      'inspection': <FileText className="w-4 h-4" />,
      'emergency': <AlertTriangle className="w-4 h-4" />
    };
    return icons[type];
  };

  const allMaintenanceItems = (isAllVehiclesMode ? data.flatMap(v => [...v.maintenanceHistory, ...v.maintenanceTasks]) : [...vehicle!.maintenanceHistory, ...vehicle!.maintenanceTasks])
    .sort((a, b) => {
      const dateA = new Date('date' in a ? a.date : a.dueDate).getTime();
      const dateB = new Date('date' in b ? b.date : b.dueDate).getTime();
      return dateB - dateA;
    });

  const allTasks = isAllVehiclesMode ? data.flatMap(v => v.maintenanceTasks) : vehicle!.maintenanceTasks;

  const upcomingTasks = allTasks.filter(task => 
    task.status === 'pending' && new Date(task.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const overdueTasks = allTasks.filter(task => 
    task.status === 'pending' && new Date(task.dueDate) < new Date()
  );

  const totalMaintenanceCost = (isAllVehiclesMode ? data.flatMap(v => v.maintenanceHistory) : vehicle!.maintenanceHistory).reduce((sum, record) => sum + record.cost, 0);
  const totalHistoryCount = (isAllVehiclesMode ? data.flatMap(v => v.maintenanceHistory) : vehicle!.maintenanceHistory).length;
  const avgCostPerService = totalMaintenanceCost / totalHistoryCount || 0;

  const renderOverview = () => (
    !isAllVehiclesMode && vehicle ? (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-600">Overdue Tasks</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Upcoming (30 days)</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{upcomingTasks.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Total Cost (YTD)</span>
          </div>
          <Currency value={totalMaintenanceCost} className="text-2xl font-bold text-green-600" />
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Avg Cost/Service</span>
          </div>
          <Currency value={avgCostPerService} className="text-2xl font-bold text-blue-600" />
        </div>
      </div>

      {/* Urgent Alerts */}
      {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Maintenance Alerts
          </h3>
          <div className="space-y-2">
            {overdueTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between text-sm">
                <span className="text-red-700">{task.description}</span>
                <span className="text-red-600 font-medium">
                  Overdue by {Math.ceil((Date.now() - new Date(task.dueDate).getTime()) / (24 * 60 * 60 * 1000))} days
                </span>
              </div>
            ))}
            {upcomingTasks.slice(0, 2).map(task => (
              <div key={task.id} className="flex items-center justify-between text-sm">
                <span className="text-orange-700">{task.description}</span>
                <span className="text-orange-600 font-medium">
                  Due {formatDate(new Date(task.dueDate))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Maintenance Items */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">All Maintenance Items</h3>
          {!isAllVehiclesMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('brief')}
                className={`p-1 rounded ${viewMode === 'brief' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Rows className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="divide-y">
          {allMaintenanceItems.length > 0 ? (
            allMaintenanceItems.map(item => (
              viewMode === 'list' ? (
                <MaintenanceItem item={item} key={item.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === item.id) || v.maintenanceHistory.some(h => h.id === item.id)) : vehicle} />
              ) : (
                <BriefMaintenanceItem item={item} key={item.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === item.id) || v.maintenanceHistory.some(h => h.id === item.id)) : vehicle} />
              )
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No maintenance items found.</p>
          )}
        </div>
      </div>
    </div>
    ) : null
  );

  const renderHistory = () => {
    const historyItems = isAllVehiclesMode ? data.flatMap(v => v.maintenanceHistory) : vehicle!.maintenanceHistory;
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Complete Maintenance History</h3>
          {!isAllVehiclesMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('brief')}
                className={`p-1 rounded ${viewMode === 'brief' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Rows className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="divide-y">
          {historyItems.length > 0 ? (
            historyItems.map(record => (
              viewMode === 'list' ? (
                <MaintenanceItem item={record} key={record.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceHistory.some(h => h.id === record.id)) : vehicle} />
              ) : (
                <BriefMaintenanceItem item={record} key={record.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceHistory.some(h => h.id === record.id)) : vehicle} />
              )
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No maintenance history found.</p>
          )}
        </div>
      </div>
    );
  };

  const renderAlerts = () => (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Overdue Maintenance Tasks</h3>
        {!isAllVehiclesMode && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('brief')}
              className={`p-1 rounded ${viewMode === 'brief' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Rows className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="divide-y">
        {overdueTasks.length > 0 ? (
          overdueTasks.map(task => (
            viewMode === 'list' ? (
              <MaintenanceItem item={task} key={task.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === task.id)) : vehicle} />
            ) : (
              <BriefMaintenanceItem item={task} key={task.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === task.id)) : vehicle} />
            )
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No overdue maintenance tasks.</p>
        )}
      </div>
    </div>
  );

  const renderScheduled = () => {
    const scheduledTasks = allTasks.filter(t => t.status === 'pending');
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Scheduled Maintenance Tasks</h3>
          {!isAllVehiclesMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('brief')}
                className={`p-1 rounded ${viewMode === 'brief' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Rows className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="divide-y">
          {scheduledTasks.length > 0 ? (
            scheduledTasks.map(task => (
              viewMode === 'list' ? (
                <MaintenanceItem item={task} key={task.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === task.id)) : vehicle} />
              ) : (
                <BriefMaintenanceItem item={task} key={task.id} vehicle={isAllVehiclesMode ? vehicles.find(v => v.maintenanceTasks.some(t => t.id === task.id)) : vehicle} />
              )
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No scheduled maintenance tasks.</p>
          )}
        </div>
      </div>
    );
  };

  const renderAddTaskForm = () => (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <h4 className="font-medium text-gray-900 mb-4">Add New Maintenance Task</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Task description"
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <select className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="routine">Routine</option>
          <option value="repair">Repair</option>
          <option value="inspection">Inspection</option>
          <option value="emergency">Emergency</option>
        </select>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Estimated cost"
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Save Task
        </button>
        <button
          onClick={() => setShowAddTask(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  interface MaintenanceItemProps {
    item: MaintenanceRecord | MaintenanceTask;
    vehicle?: Vehicle;
  }
  
  const MaintenanceItem: React.FC<MaintenanceItemProps> = ({ item, vehicle }) => {
    const isTask = 'dueDate' in item;
  
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className={`p-2 rounded-lg ${
                    item.type === 'emergency' ? 'bg-red-100' :
                    item.type === 'repair' ? 'bg-orange-100' :
                    item.type === 'inspection' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    {getMaintenanceTypeIcon(item.type)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{item.type}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <h4 className="font-medium text-gray-900">{item.description}</h4>
              <div className="flex items-center gap-2">
                {!isTask && <p className="text-sm text-gray-500 capitalize">{(item as MaintenanceRecord).type} maintenance</p>}
                {isAllVehiclesMode && vehicle && (
                  <Link 
                    to={`/maintenance/${vehicle.id}`}
                    className="text-sm text-blue-500 hover:underline hover:text-blue-700"
                  >
                    {vehicle.plateNumber}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
            {item.status.toUpperCase()}
          </span>
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-500">{isTask ? "Due Date" : "Date"}:</span>
            <p className={`font-medium ${
              isTask && new Date((item as MaintenanceTask).dueDate) < new Date() ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatDate(new Date(isTask ? (item as MaintenanceTask).dueDate : (item as MaintenanceRecord).date))}
            </p>
          </div>
          <div>
            <span className="text-gray-500">{isTask ? "Est. Cost" : "Cost"}:</span>
            <Currency value={isTask ? (item as MaintenanceTask).estimatedCost : (item as MaintenanceRecord).cost} className="font-medium text-green-600" />
          </div>
          <div>
            <span className="text-gray-500">{isTask ? "Est. Duration" : "Mileage"}:</span>
            <p className="font-medium">{isTask ? `${(item as MaintenanceTask).estimatedDuration} hours` : `${(item as MaintenanceRecord).mileage.toLocaleString()} km`}</p>
          </div>
          <div>
            <span className="text-gray-500">{isTask ? "Assigned To" : "Duration"}:</span>
            <p className="font-medium">{isTask ? (item as MaintenanceTask).assignedTo || 'Unassigned' : `${(item as MaintenanceRecord).duration} hours`}</p>
          </div>
        </div>
  
        {!isTask && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Service Provider:</span>
              <p className="font-medium">{(item as MaintenanceRecord).serviceProvider}</p>
            </div>
            <div>
              <span className="text-gray-500">Technician:</span>
              <p className="font-medium">{(item as MaintenanceRecord).technician}</p>
            </div>
          </div>
        )}
  
        {item.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Notes:</span>
            <p className="text-sm text-gray-700 mt-1">{item.notes}</p>
          </div>
        )}
      </div>
    );
  };

  const BriefMaintenanceItem: React.FC<MaintenanceItemProps> = ({ item, vehicle }) => {
    const isTask = 'dueDate' in item;
    return (
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={`p-2 rounded-lg ${
                  item.type === 'emergency' ? 'bg-red-100' :
                  item.type === 'repair' ? 'bg-orange-100' :
                  item.type === 'inspection' ? 'bg-blue-100' :
                  'bg-green-100'
                }`}>
                  {getMaintenanceTypeIcon(item.type)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{item.type}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <h4 className="font-medium text-gray-900">{item.description}</h4>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{isTask ? `Due: ${formatDate(new Date((item as MaintenanceTask).dueDate))}` : `Date: ${formatDate(new Date((item as MaintenanceRecord).date))}`}</span>
              <span>{' • '}</span>
              <span>Cost: <Currency value={isTask ? (item as MaintenanceTask).estimatedCost : (item as MaintenanceRecord).cost} /></span>
              {isAllVehiclesMode && vehicle && (
                <>
                  <span className="text-gray-400">{' • '}</span>
                  <Link 
                    to={`/maintenance/${vehicle.id}`}
                    className="text-sm text-blue-500 hover:underline hover:text-blue-700"
                  >
                    {vehicle.plateNumber}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
          {item.status.toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAllVehiclesMode ? 'Back to Dashboard' : `Back to Vehicle Details (${vehicle!.plateNumber})`}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isAllVehiclesMode ? 'All Vehicle Maintenance' : `Vehicle Maintenance - ${vehicle!.plateNumber}`}
              </h2>
              {!isAllVehiclesMode && vehicle && (
                <div className="flex items-center gap-2">
                  <p className="text-gray-600">
                    {vehicle.make} {vehicle.model} ({vehicle.year}) • {vehicle.mileage.toLocaleString()} km
                  </p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <VehicleCombobox currentVehicleId={vehicle?.id} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => setShowAddTask(prev => !prev)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={isAllVehiclesMode}
                  >
                    <Plus className="w-4 h-4" />
                    {showAddTask ? 'Cancel' : 'Add Task'}
                  </Button>
                </TooltipTrigger>
                {isAllVehiclesMode && (
                  <TooltipContent>
                    <p>Select a specific vehicle to add a task.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {!isAllVehiclesMode && showAddTask && renderAddTaskForm()}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            ...(!isAllVehiclesMode ? [{ id: 'overview', label: 'Overview', icon: TrendingUp }] : []),
            { id: 'overdue', label: 'Overdue', icon: AlertTriangle },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
            ...(!isAllVehiclesMode ? [{ id: 'record', label: 'Maintenance Record', icon: FileText }] : []),
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabId)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === 'overdue' && overdueTasks.length > 0 && (
                <span className="ml-2 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">
                  {overdueTasks.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'overdue' && renderAlerts()}
      {activeTab === 'scheduled' && renderScheduled()}
      {activeTab === 'record' && renderHistory()}
    </div>
  );
};