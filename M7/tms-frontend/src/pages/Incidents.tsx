
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Clock, Camera, FileText } from 'lucide-react';

const Incidents = () => {
  const navigate = useNavigate();
  const [incidents] = useState([
    {
      id: 'INC001',
      type: 'Vehicle Collision',
      description: 'Minor collision at intersection of Main St and Oak Ave',
      date: '2024-01-22',
      time: '14:30',
      location: 'Main St & Oak Ave, Boston, MA',
      involvedVehicles: ['TR003'],
      involvedPersonnel: ['Mike Johnson'],
      status: 'Under Investigation',
      urgency: 'high',
      sequenceOfEvents: 'Vehicle stopped at red light, rear-ended by civilian vehicle',
      immediateActions: 'Emergency services called, police report filed, vehicle towed',
      evidence: ['Photos of damage', 'Police report #PR2024-001', 'Witness statements'],
    },
    {
      id: 'INC002',
      type: 'Cargo Spill',
      description: 'Small oil leak from container during loading',
      date: '2024-01-21',
      time: '09:15',
      location: 'Warehouse District, Newark, NJ',
      involvedVehicles: ['TR001'],
      involvedPersonnel: ['Sarah Lee', 'Tom Wilson'],
      status: 'Resolved',
      urgency: 'medium',
      sequenceOfEvents: 'Container seal damaged during loading causing minor oil leak',
      immediateActions: 'Spill contained, area cleaned, container resealed',
      evidence: ['Cleanup photos', 'Environmental report'],
    },
    {
      id: 'INC003',
      type: 'Equipment Failure',
      description: 'Hydraulic lift malfunction during cargo unloading',
      date: '2024-01-20',
      time: '16:45',
      location: 'Customer Site - Tech Solutions Inc',
      involvedVehicles: ['TR005'],
      involvedPersonnel: ['David Chen'],
      status: 'Action in Progress',
      urgency: 'low',
      sequenceOfEvents: 'Hydraulic pump failure during routine unloading operation',
      immediateActions: 'Manual unloading completed, equipment isolated, repair scheduled',
      evidence: ['Equipment diagnostic report', 'Service ticket #ST2024-015'],
    },
    {
      id: 'INC004',
      type: 'Route Blockage',
      description: 'Road closure due to construction work',
      date: '2024-01-22',
      time: '11:20',
      location: 'Highway 95, mile marker 45',
      involvedVehicles: ['TR002', 'TR004'],
      involvedPersonnel: ['Alex Rodriguez', 'Lisa Park'],
      status: 'Reported',
      urgency: 'medium',
      sequenceOfEvents: 'Unexpected road closure encountered, traffic diverted',
      immediateActions: 'Alternative route taken, customers notified of delay',
      evidence: ['Route deviation GPS data', 'Customer notifications'],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'under investigation': return 'bg-blue-100 text-blue-800';
      case 'action in progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vehicle collision': return '🚗';
      case 'cargo spill': return '🛢️';
      case 'equipment failure': return '⚙️';
      case 'route blockage': return '🚧';
      case 'theft': return '🔒';
      case 'fire': return '🔥';
      default: return '⚠️';
    }
  };

  const urgentIncidents = incidents.filter(inc => inc.urgency === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          <p className="text-gray-600">Track and manage all reported incidents</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => navigate('/incidents/new')}
        >
          Report New Incident
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={AlertTriangle}
          label="Urgent Incidents"
          value={urgentIncidents}
          bgColor="bg-red-50"
          borderColor="border-red-200"
          labelColor="text-red-800"
          valueColor="text-red-600"
          iconColor="text-red-600"
        />
        
        <StatCard
          icon={Clock}
          label="Under Investigation"
          value={incidents.filter(inc => inc.status === 'Under Investigation').length}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          labelColor="text-blue-800"
          valueColor="text-blue-600"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={FileText}
          label="In Progress"
          value={incidents.filter(inc => inc.status === 'Action in Progress').length}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          labelColor="text-orange-800"
          valueColor="text-orange-600"
          iconColor="text-orange-600"
        />

        <StatCard
          icon={Camera}
          label="Resolved"
          value={incidents.filter(inc => inc.status === 'Resolved').length}
          bgColor="bg-green-50"
          borderColor="border-green-200"
          labelColor="text-green-800"
          valueColor="text-green-600"
          iconColor="text-green-600"
        />
      </div>

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
          <CardDescription>Complete list of reported incidents with details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTypeIcon(incident.type)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{incident.id} - {incident.type}</h3>
                      <p className="text-gray-600">{incident.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getUrgencyColor(incident.urgency)}>
                      {incident.urgency} urgency
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                    <p className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {incident.date} at {incident.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {incident.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Involved</p>
                    <p className="font-medium">
                      {incident.involvedVehicles.join(', ')} | {incident.involvedPersonnel.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Sequence of Events:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {incident.sequenceOfEvents}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Immediate Actions Taken:</p>
                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      {incident.immediateActions}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Supporting Evidence:</p>
                    <div className="flex flex-wrap gap-2">
                      {incident.evidence.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          📄 {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                  <Button variant="outline" size="sm">
                    Add Evidence
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
